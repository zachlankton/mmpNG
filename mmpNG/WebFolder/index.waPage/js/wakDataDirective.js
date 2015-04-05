csAppServices.directive('wakData', function(){
    return {
        restrict: 'A',
        transclude: true,
        scope: true,
        ////////////////
        // CONTROLLER //
        ////////////////
        controller: function($scope, $element, $attrs, $transclude, csAppData, $wakanda, $interpolate) {

            $scope.wakDataDir = csAppData.getData();
            var rScope = $scope.wakDataDir;
            $scope.current = rScope.current;

            //////////
            // INIT //
            //////////
            $scope.init = function(){
                var testData = testDataAttr();  // test if we need to handle a collection or entity
                if (testData == undefined){  //if it is undefined it is expected that it is a wkDataClass Name
                    try{
                        var test = rScope.current[$attrs.wakData].ID; // Check if data has already been loaded and selected
                        $scope.collection = rScope.collections[$attrs.wakData];  // if so reuse it
                    }catch(err){
                        $scope.getCollection();    // if not, call the server to fetch the collection
                    } 
                }else{
                    $scope.getAllData(testData); // if testData is defined, it means it contains a reference to an entity object
                    //load the scope with the entity data
                }
                setWatch(testData); // set any watches that are necessary
            };

            ////////////////////
            // TEST DATA ATTR //
            ////////////////////   Checks to see if wak-data value is an object string if not it will return undefined
            var testDataAttr = function(){
                var nameSpaces = $attrs.wakData.split(".");
                var nScope = $scope[nameSpaces[0]];
                nameSpaces.forEach(function(val, index){
                    if(index != 0){nScope = nScope[val];}
                });
                return nScope;
            };


            ////////////////////
            // GET COLLECTION //
            ////////////////////
            $scope.getCollection = function(){
                var dClass = $attrs.wakData;
                var filterObj = getFilterObj();
                filterObj.pageSize = 999999999;

                rScope.current[dClass] = {};

                $scope.collection = 
                rScope.collections[dClass] = $wakanda.$ds[dClass].$find(filterObj);
            };

            ///////////////////////
            // GET FILTER OBJECT //
            ///////////////////////
            var getFilterObj = function(){
                if ($attrs.filter == undefined){return {};}
                var typeOfFilter = getTypeOfFilter();

                if (typeOfFilter == undefined){ return getAdvancedFilter(); }

                return getSimpleFilter(typeOfFilter);
                
            };

            ////////////////////////
            // GET TYPE OF FILTER //
            ////////////////////////
            var getTypeOfFilter = function(){
                var nScope = undefined;
                try {
                    nScope = $wakanda.$ds[$attrs.filter]
                }catch(err){
                    console.log(err);
                }
                return nScope;
            };

            //////////////////////////////
            // GET SIMPLE FILTER OBJECT //
            //////////////////////////////
            var getSimpleFilter = function(filterEntity){
                var dcName = filterEntity.$name;
                var currentEntity = $scope.current[dcName];

                var attr = getRelatedAttribute(dcName);
                
                var filter = attr.name + ".ID == " + currentEntity.ID;
                return {
                    filter: filter
                }
            };


            ////////////////////////////////
            // GET ADVANCED FILTER OBJECT //
            ////////////////////////////////
            var getAdvancedFilter = function(){
                var filterObj = {}
                if ($attrs.filter != undefined){filterObj.filter = $attrs.filter;}
                if ($attrs.params != undefined && $attrs.params == "") {return 0;}

                var iParams = getParams();
                if(testParams(iParams) == false){return 0;}
                filterObj.params = iParams; 
                return filterObj;
            };

            //////////////////////////////////
            // GET RELATED FILTER ATTRIBUTE //
            //////////////////////////////////
            var getRelatedAttribute = function(dcName){
                var dc = $wakanda.$ds[$attrs.wakData];
                var attribute = {}
                for (key in dc){
                    if (dc[key].path == dcName){
                        attribute = dc[key];
                        break;
                    }
                }
                return attribute;
            }

            ////////////////
            // GET PARAMS //
            ////////////////
            var getParams = function(){
                if ($attrs.params != undefined){
                    $attrs.params = $attrs.params.replace(/\s+/g, '');
                    var params = $attrs.params.split(",");
                    
                    var iParams = [];
                    params.forEach(function(val, index){
                        var intrp = $interpolate("{{"+val+"}}");
                        iParams.push(intrp($scope));
                    });

                    return iParams;
                }
            }
            
            /////////////////////////////
            // TEST ALL PARAMS ARE SET //
            /////////////////////////////
            var testParams = function(params){
                if (params == undefined){return true;}
                var results = [];
                params.forEach(function(val, index){
                   if (val != ""){results.push(val);} 
                });
                if (params.length == results.length){return true;}
                return false;
            }

            /////////////////////////////////////
            // GET ALL CURRENT DATA ONTO SCOPE //
            /////////////////////////////////////
            $scope.getAllData = function(data){
                $scope.entity = data;
            };

            ///////////////////
            // SAVE FUNCTION //
            ///////////////////
            $scope.save = function(){
                $scope.entity.$save()
                .then(function(a){
                    $scope.wakDataForm.$setPristine();
                })
                .catch(function(error){
                    console.log(error);
                });
            };
            
            ////////////////////////////
            // CREATE OBJECT FUNCTION //
            ////////////////////////////
            $scope.createObj = function(value){
                var createObj = {};               
                if ($attrs.filter == undefined){return createObj;}
                var dcName = $attrs.watch;
                var currentEntity = $scope.current[dcName];
                var attr = getRelatedAttribute(dcName);
                createObj[attr.name] = currentEntity;
                return createObj;
            };

            ////////////////////////////
            // SET WATCH IF NECESSARY //
            ////////////////////////////
            var setWatch = function(scopeVar){
                // THIS IS FOR UPDATING A SELECTION
                if (scopeVar != undefined){
                    $scope.$watch($attrs.wakData, function(newV, oldV){
                        $scope.getAllData(testDataAttr());
                    } );
                }
                
                var filterEntity = getTypeOfFilter();
                try { //CHECK TO SEE IF WE ARE USING A SIMPLE FILTER AND SETUP OUR WATCH USING THAT
                    var dcName = filterEntity.$name;
                    $attrs.watch = dcName; 
                } catch(err){}
                  
                // THIS IS FOR UPDATING A COLLECTION
                if ($attrs.watch != undefined){
                    $scope.$watch('current.' + $attrs.watch, function(newV, oldV){
                        
                        //THESE CONDITIONS MAKE SURE THE COLLECTION IS ONLY UPDATED ON CHANGES... NOT ON INIT
                        if (newV == undefined && oldV == undefined){return 0;}
                        if (newV != undefined && oldV == undefined){$scope.getCollection(); return 0;}
                        if (newV.ID !== oldV.ID){$scope.getCollection();}
                    });
                }
            };
            
            
            
            ///////////////////////////
            // TRANSCLUSION FUNCTION //
            ///////////////////////////
            $transclude($scope, function(clone, scope){
                 $element.append(clone);
            });

            
        },

        //////////
        // LINK //
        //////////
        link: function(scope, iElement, iAttrs, controller, transcludeFn) {
            scope.init();
        }
        
        
    };
});