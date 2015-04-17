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
            $scope.collection = {};

            //////////
            // INIT //
            //////////
            $scope.init = function(){
                var testData = testDataAttr();  // test if we need to handle a collection or entity
                if (testData == undefined){  //if it is undefined it is expected that it is a wkDataClass Name
                    try{
                        var test = rScope.current[$attrs.wakData].ID; // Check if data has already been loaded and selected
                        if (test == undefined){throwUndefinedErrorFunction();}
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

            /////////////////////////
            // GET DATA CLASS NAME //
            /////////////////////////
            var getDataClassName = function(){
                var test = testDataAttr();
                if (test == undefined){return $attrs.wakData;}
                if (test.$_entity != undefined) {
                    return test.$_entity._private.dataClass.$name;
                } return undefined;
            };

            /////////////////
            // CONSOLE LOG //
            /////////////////
            $scope.console = function(obj){console.log(obj);}


            ////////////////////
            // GET COLLECTION //
            ////////////////////
            $scope.getCollection = function(){
                var dClass = $attrs.wakData;
                if ($wakanda.$ds[dClass] == undefined){return 0;}
                var filterObj = getFilterObj();
                filterObj.pageSize = 999999999;

                rScope.current[dClass] = {};

                if (filterObj == "PARAMS_NOT_AVAILABLE"){return 0;}

                $scope.collection = 
                rScope.collections[dClass] = $wakanda.$ds[dClass].$find(filterObj);
            };

            ///////////////////////
            // GET FILTER OBJECT //
            ///////////////////////
            var getFilterObj = function(){
                if ($attrs.filter == undefined){return {};}
                var typeOfFilter = getTypeOfFilter();
                var filterObj = {};
                if (typeOfFilter == undefined){ filterObj =  getAdvancedFilter(); }
                else { filterObj = getSimpleFilter(typeOfFilter); }
                
                if ($attrs.wakSelect != undefined){
                    filterObj.select = $attrs.wakSelect;
                }

                return filterObj;
                
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
                if (currentEntity.ID == undefined){return "PARAMS_NOT_AVAILABLE";}
                
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
                if(testParams(iParams) == false){return "PARAMS_NOT_AVAILABLE";}
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
                var dClass = getDataClassName();
                $scope.collection = rScope.collections[dClass];
            };

            ///////////////////
            // SAVE FUNCTION //
            ///////////////////
            $scope.save = function(entity){
                entity = entity || $scope.entity;
                entity.$save()
                .then(function(a){
                    $scope.wakDataForm.$setPristine();
                })
                .catch(function(error){
                    console.log(error);
                });
            };

            ///////////////////
            //  ADD FUNCTION //
            ///////////////////
            $scope.add = function(cObject){
                var createObj = $scope.createObj(cObject);
                var dClass = getDataClassName();
                var newEntity = $wakanda.$ds[dClass].$create(createObj);
                newEntity.$save().then(function(){
                    $scope.collection.push(newEntity);
                    $scope.current[dClass] = newEntity;
                    clearFormObject(cObject);
                });
            };

            ///////////////////////
            // CLEAR FORM OBJECT //
            ///////////////////////
            var clearFormObject = function(formObj){
                for (key in formObj){
                    formObj[key] = "";
                }
            };
            
            /////////////////////
            // REMOVE FUNCTION //
            /////////////////////
            $scope.remove = function(entity){
                entity = entity || $scope.entity;
                entity.$remove().then(function(){
                    removeFromLocalCollection(entity);    
                });
            };

            //////////////////////////////////
            // REMOVE FROM LOCAL COLLECTION //
            //////////////////////////////////
            var removeFromLocalCollection = function(entity){
                var collection = $scope.collection;
                var i;
                collection.forEach(function(val, index){
                    if (val.ID == entity.ID){i = index;}
                });  
                collection.splice(i, 1);
            }

            ////////////////////////////
            // CREATE OBJECT FUNCTION //
            ////////////////////////////
            $scope.createObj = function(cObject){
                var createObj = {};
                if ((typeof cObject) == "object"){
                    createObj = cObject;
                }
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

csAppServices.directive('wi', function(){
    return {
        templateUrl: "/index.waPage/wiTemplate.html",
        replace: true,
        scope: {
            wBlur: "=",
            wLabel: "@",
            wCol: "@",
            wModel: "=",
            blurArgs: "=",
            wType: "@"
        },
        controller: function($scope, $element, $attrs){
            $scope.screen = "md";
            $scope.lessColPadding = "";
            $scope.formGroupSize = "form-group-sm";
            $scope.inputTag = "input";

            
            if ($attrs.readonly != undefined){$scope.defaultCursor = "default-cursor";}
            if ($attrs.xs != undefined){$scope.screen = "xs";}
            if ($attrs.tf != undefined){$scope.tinyFont = "tiny-font";}
            if ($attrs.tiny != undefined){$scope.inputTiny = "input-tiny"; $scope.formGroupSize = "form-group-tiny"; $scope.lessColPadding = "less-col-padding"}
            if ($attrs.text != undefined){$scope.inputTag = "textarea"; $scope.formGroupSize = ""; $scope.inputTiny = "input-sm";}
            if ($attrs.wCol == undefined){$scope.lessColPadding = "";}
            if ($attrs.hr != undefined){$scope.hrLabelCol = $attrs.hr || "3"; $scope.hrInputCol = (12 - parseInt($scope.hrLabelCol));}
            
            $scope._blur = function(){
                if ($scope.blurArgs == undefined){
                    $scope.wBlur();
                }else{
                    $scope.wBlur($scope.blurArgs);
                }
            };
        },

        compile: function(tElement, tAttrs){
            if (tAttrs.wBlur == undefined){tAttrs.wBlur = "save";}
            if (tAttrs.readonly != undefined){tElement.find('.form-control').attr("readonly", "");}
        }
    };
});


csAppServices.directive('wakModInfo', function () {
    return {

        templateUrl: "/index.waPage/wakModInfoTemplate.html", 
        replace: true,
        scope: false,
        controller: function($scope, $element, $attrs, $transclude) {
            $scope.col = $attrs.col;
        },

    }
});
