$(function () {
    var Editor2DView, Editor3DView, EditorView, EditorViewport, EditorViewportProxy, SceneMeshsView, animate, editor, editor2dview, editor3dview, editor3dviewanimate, height, helper, static_url, viewport2d, viewport3d, viewportProxy, width;
    static_url = '/static/';
    window.scenes = [];
    window.floors = [];
    helper = window.helper;
    EditorViewport = Backbone.Model.extend({
                                               afterAddObject: function (obj, options) {
                                                   var objects;
                                                   if (options == null) {
                                                       options = {};
                                                   }
                                                   objects = this.get('objects');
                                                   if (helper.inArray(obj, objects)) {
                                                       return false;
                                                   }
                                                   objects.push(obj);
                                                   helper.extendFrom(obj, options);
                                                   return this.trigger('meshAdded');
                                               },
                                               addToProxy: function (proxy) {
                                                   this.proxy = proxy;
                                                   proxy.addViewport(this);
                                                   return this;
                                               },
// loadSceneFromJson: (json) ->
// this.loadFloorFromJson json.floor
// this.loadWallsFromJson json.walls
// this.loadSkyboxFromJson json.skybox
// this.loadFogFromJson json.fog
// this.loadLightsFromJson json.lights
// loadScene: (sceneUrl) ->
// if this.get('scene') == undefined
// this.initScene()
// helper.loadSceneJson(sceneUrl, _.bind(this.loadSceneFromJson, this))
                                               initialize: function () {
                                                   this.set('objects', []);
                                                   this.initUtils();
                                                   this.initScene();
                                                   // this.initLight()
                                                   this.initDerectionHelp();
                                                   this.initControls();
                                                   this.initEvents();
                                                   // this.loadWall(static_url + 'json/qiangbi2.json', static_url + 'img/sicai001.jpg', 3.0, {x: 1.57, y: 0, z: 0})
                                                   // this.initSkybox()
                                                   // this.initFog()
                                                   this.initFloor();
                                                   // this.loadFloor(static_url + 'img/diban1.jpg')
                                                   // this.loadScene(static_url + 'resources/scenes/test.json')
                                               },
                                               initFloor: function () {
                                                   var floor, floorGeometry, floorMaterial, floorTexture, jsonLoader, proportion, scene;
                                                   scene = this.get('scene');
                                                   jsonLoader = this.get('jsonLoader');
                                                   floorTexture = THREE.ImageUtils.loadTexture(static_url + 'img/checkerboard.jpg');
                                                   floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
                                                   floorTexture.repeat.set(10, 10);
                                                   floorMaterial = new THREE.MeshBasicMaterial({
                                                                                                   map: floorTexture
                                                                                               });
                                                   floorGeometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
                                                   floor = new THREE.Mesh(floorGeometry, floorMaterial);
                                                   floor.position.set(0, 0, 0);
                                                   proportion = 1.0;
                                                   helper.scaleObject3D(floor, proportion);
                                                   floor.doubleSided = true;
                                                   scene.add(floor);
                                                   this.set('floorboard', floor);
                                                   return this.afterAddObject(floor, {
                                                       name: 'floorboard',
                                                       meshType: 'floor'
                                                   });
                                               },
                                               loadFloorFromJson: function (json) {
                                                   var floor, floorboard, geom, material, oldFloor, scene;
                                                   json = helper.preprocessJsonResource(json, 'floor');
                                                   if (this.get('floorboard') === void 0) {
                                                       this.initFloor();
                                                   }
                                                   scene = this.get('scene');
                                                   floorboard = this.get('floorboard');
                                                   floorboard.visible = false;
                                                   oldFloor = this.get('floor');
                                                   if (oldFloor !== void 0) {
                                                       scene.remove(oldFloor);
                                                       this.set('floor', void 0);
                                                   }
                                                   geom = new THREE.PlaneGeometry(json.width, json.height, json.widthSegments, json.heightSegments);
                                                   material = helper.loadMaterialFromJson(json.material);
                                                   floor = new THREE.Mesh(geom, material);
                                                   scene.add(floor);
                                                   helper.updateMeshFromJson(floor, json);
                                                   this.set('floor', floor);
                                                   return this.afterAddObject(floor, {
                                                       name: 'floor',
                                                       meshType: 'floor'
                                                   });
                                               },
                                               loadFloor: function (textureUrl, width, height) {
                                                   var floor, floorboard, geom, material, oldFloor, scene, texture;
                                                   if (width == null) {
                                                       width = 2000;
                                                   }
                                                   if (height == null) {
                                                       height = 2000;
                                                   }
                                                   scene = this.get('scene');
                                                   floorboard = this.get('floorboard');
                                                   floorboard.visible = false;
                                                   oldFloor = this.get('floor');
                                                   if (oldFloor !== void 0) {
                                                       scene.remove(oldFloor);
                                                       this.set('floor', void 0);
                                                   }
                                                   geom = new THREE.PlaneGeometry(width, height, 10, 10);
                                                   texture = THREE.ImageUtils.loadTexture(textureUrl);
                                                   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                                                   texture.repeat.set(width / 50, height / 50);
                                                   material = new THREE.MeshBasicMaterial({
                                                                                              map: texture
                                                                                          });
                                                   floor = new THREE.Mesh(geom, material);
                                                   floor.doubleSided = true;
                                                   scene.add(floor);
                                                   this.set('floor', floor);
                                                   return this.afterAddObject(floor, {
                                                       name: 'floor',
                                                       meshType: 'floor'
                                                   });
                                               },
                                               loadWallFromjson: function (json) {
                                                   var scene, wall;
                                                   scene = this.get('scene');
                                                   wall = helper.loadWallFromJson(json);
                                                   scene.add(wall);
                                                   return this.afterAddObject(wall);
                                               },
                                               loadWallsFromJson: function (json) {
                                                   var jsonLoader, scene, wallJson, _i, _len, _results;
                                                   jsonLoader = this.get('jsonLoader');
                                                   scene = this.get('scene');
                                                   _results = [];
                                                   for (_i = 0, _len = json.length; _i < _len; _i++) {
                                                       wallJson = json[_i];
                                                       _results.push(this.loadWallFromjson(wallJson));
                                                   }
                                                   return _results;
                                               },
                                               loadWall: function (geomUrl, textureUrl, proportion, rotation) {
                                                   var jsonLoader, scene;
                                                   if (proportion == null) {
                                                       proportion = 1.0;
                                                   }
                                                   if (rotation == null) {
                                                       rotation = {
                                                           x: 0,
                                                           y: 0,
                                                           z: 0
                                                       };
                                                   }
                                                   jsonLoader = this.get('jsonLoader');
                                                   scene = this.get('scene');
                                                   return jsonLoader.load(geomUrl, function (geom) {
                                                       var material, mesh, texture;
                                                       texture = THREE.ImageUtils.loadTexture(textureUrl);
                                                       texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                                                       texture.repeat.set(10, 10);
                                                       material = new THREE.MeshBasicMaterial({
                                                                                                  // map: texture
                                                                                                  color: 0xff0000,
                                                                                                  transparent: true,
                                                                                                  opacity: 0.5
                                                                                              });
                                                       mesh = new THREE.Mesh(geom, material);
                                                       mesh.receiveShadow = true;
                                                       mesh.doubleSided = true;
                                                       mesh.rotation.x = rotation.x;
                                                       mesh.rotation.y = rotation.y;
                                                       mesh.rotation.z = rotation.z;
                                                       mesh.scale.x *= proportion;
                                                       mesh.scale.y *= proportion;
                                                       mesh.scale.z /= proportion;
                                                       mesh.castShadow = true;
                                                       return scene.add(mesh);
                                                   });
                                               },
                                               loadSkyboxFromJson: function (json) {
                                                   var geom, material, scene, skybox;
                                                   json = helper.preprocessJsonResource(json, 'skybox');
                                                   scene = this.get('scene');
                                                   geom = new THREE.CubeGeometry(json.width, json.height, json.depth);
                                                   material = helper.loadMaterialFromJson(json.material);
                                                   skybox = new THREE.Mesh(geom, material);
                                                   helper.updateMeshFromJson(skybox, json);
                                                   scene.add(skybox);
                                                   this.set('skybox', skybox);
                                                   return this.afterAddObject(skybox, {
                                                       name: 'skybox',
                                                       meshType: 'skybox'
                                                   });
                                               },
                                               initSkybox: function () {
                                                   var geom, material, scene, skybox;
                                                   scene = this.get('scene');
                                                   geom = new THREE.CubeGeometry(10000, 10000, 10000);
                                                   material = new THREE.MeshBasicMaterial({
                                                                                              color: "#9999ff"
                                                                                          });
                                                   skybox = new THREE.Mesh(geom, material);
                                                   skybox.flipSided = true;
                                                   scene.add(skybox);
                                                   return this.set('skybox', skybox);
                                               },
                                               loadFogFromJson: function (json) {
                                                   var fog, scene;
                                                   json = helper.preprocessJsonResource(json, 'fog');
                                                   scene = this.get('scene');
                                                   scene.fog = fog = new THREE.FogExp2(json.color, json.density);
                                                   return this.afterAddObject(fog);
                                               },
                                               initFog: function () {
                                                   var scene;
                                                   scene = this.get('scene');
                                                   return scene.fog = new THREE.FogExp2("#9999ff", 0.00025);
                                               },
                                               initDerectionHelp: function () {
                                                   // 绿色为 y 轴正方向
                                                   // 红色为 x 轴正方向
                                                   // 蓝色为 z 轴正方向
                                                   var scene, selectionAxis;
                                                   scene = this.get('scene');
                                                   helper.addAxis(scene, 2.0);
                                                   selectionAxis = new THREE.AxisHelper(100);
                                                   selectionAxis.material.depthTest = false;
                                                   selectionAxis.material.transparent = true;
                                                   selectionAxis.matrixAutoUpdate = false;
                                                   selectionAxis.visible = false;
                                                   return scene.add(selectionAxis);
                                               },
                                               initUtils: function () {
                                                   return this.set('jsonLoader', new THREE.JSONLoader);
                                               },
                                               initScene: function () {
                                                   var scene;
                                                   scene = new THREE.Scene;
                                                   return this.set('scene', scene);
                                               },
                                               initControls: function () {
                                                   var intersectionPlane, scene;
                                                   scene = this.get('scene');
                                                   // 用来选择Mesh的辅助平面
                                                   intersectionPlane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 8, 8));
                                                   intersectionPlane.visible = false;
                                                   scene.add(intersectionPlane);
                                                   return this.set('intersectionPlane', intersectionPlane);
                                               },
                                               loadLightsFromJson: function (json) {
                                                   var light, lightJson, lights, scene, _i, _len, _results;
                                                   scene = this.get('scene');
                                                   if (this.get('lights') === void 0) {
                                                       this.set('lights', []);
                                                   }
                                                   lights = this.get('lights');
                                                   _results = [];
                                                   for (_i = 0, _len = json.length; _i < _len; _i++) {
                                                       lightJson = json[_i];
                                                       light = helper.loadLightFromJson(lightJson);
                                                       lights.push(light);
                                                       scene.add(light);
                                                       helper.updateMeshFromJson(light, lightJson);
                                                       _results.push(this.afterAddObject(light));
                                                   }
                                                   return _results;
                                               },
                                               initLight: function () {
                                                   var light, scene;
                                                   scene = this.get('scene');
                                                   light = new THREE.DirectionalLight("#ff0000", 1.0, 0);
                                                   this.set('light', light);
                                                   light.position.set(500, 250, 500);
                                                   scene.add(light);
                                                   return scene.add(new THREE.AmbientLight("#ff0000"));
                                               },
                                               onAddMeshByJson: function (meshJson) {
                                                   var scene;
                                                   scene = this.get('scene');
                                                   switch (meshJson.meshType) {
                                                       case 'wall':
                                                           return this.loadWallFromjson(meshJson);
                                                       case 'walls':
                                                           return this.loadWallsFromJson(meshJson);
                                                       case 'floor':
                                                           return this.loadFloorFromJson(meshJson);
                                                       case 'fog':
                                                           return this.loadFogFromJson(meshJson);
                                                       case 'skybox':
                                                           return this.loadSkyboxFromJson(meshJson);
                                                       // else TODO
                                                   }
                                               },
                                               onMeshSelect: function (selected) {
                                                   this.selected = selected;
                                                   return this.trigger('meshSelected');
                                               },
                                               initEvents: function () {
                                                   this.on('addMeshByJson', this.onAddMeshByJson, this);
                                                   return this.on('meshSelect', this.onMeshSelect, this);
                                               },
                                               getSelected: function () {
                                                   return this.selected;
                                               }
                                           });
    EditorViewportProxy = Backbone.Model.extend({
                                                    loadSceneFromJson: function (json) {
                                                        return this.despatchSceneJson(json);
                                                    },
                                                    loadScene: function (url) {
                                                        return helper.loadSceneJson(url, _.bind(this.loadSceneFromJson, this));
                                                    },
                                                    despatchSceneJson: function (json, from) {
                                                        var floorJson, fogJson, lightsJson, skyboxJson, wallsJson;
                                                        if (from == null) {
                                                            from = null;
                                                        }
                                                        floorJson = helper.preprocessJsonResource(json.floor, 'floor');
                                                        wallsJson = json.walls;
                                                        lightsJson = json.lights;
                                                        fogJson = helper.preprocessJsonResource(json.fog, 'fog');
                                                        skyboxJson = helper.preprocessJsonResource(json.skybox, 'skybox');
                                                        this.despatchMeshJson(floorJson, from);
                                                        this.despatchMeshJson(fogJson, from);
                                                        this.despatchMeshJson(skyboxJson, from);
                                                        this.despatchMeshArrayJson(wallsJson, 'wall', from);
                                                        return this.despatchMeshArrayJson(lightsJson, 'light', from);
                                                    },
                                                    despatchMeshJson: function (json, from) {
                                                        var viewport, _i, _len, _ref, _results;
                                                        if (from == null) {
                                                            from = null;
                                                        }
                                                        _ref = this.get('viewports');
                                                        _results = [];
                                                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                                            viewport = _ref[_i];
                                                            if (viewport !== from) {
                                                                _results.push(viewport.trigger('addMeshByJson', json));
                                                            } else {
                                                                _results.push(void 0);
                                                            }
                                                        }
                                                        return _results;
                                                    },
                                                    despatchMeshArrayJson: function (array, type, from) {
                                                        var json, _i, _len, _results;
                                                        if (type == null) {
                                                            type = 'mesh';
                                                        }
                                                        if (from == null) {
                                                            from = null;
                                                        }
                                                        _results = [];
                                                        for (_i = 0, _len = array.length; _i < _len; _i++) {
                                                            json = array[_i];
                                                            helper.preprocessJsonResource(json, type);
                                                            _results.push(this.despatchMeshJson(json, from));
                                                        }
                                                        return _results;
                                                    },
                                                    initialize: function () {
                                                        this.set('viewports', []);
                                                        return this.on('all', function () {
                                                            var viewports, _arguments;
                                                            _arguments = _.toArray(arguments);
                                                            if (_arguments[0].endsWith('ed')) {
                                                                return;
                                                            }
                                                            viewports = this.get('viewports');
                                                            return _.each(viewports, function (viewport) {
                                                                return viewport.trigger.apply(viewport, _arguments);
                                                            });
                                                        });
                                                    },
                                                    startListen: function () {
                                                        var viewport, viewports;
                                                        viewports = this.get('viewports');
                                                        if (viewports.length <= 0) {
                                                            return false;
                                                        }
                                                        viewport = viewports[0];
                                                        this.listenTo(viewport, 'meshAdded', function () {
                                                            return this.trigger('meshAdded');
                                                        });
                                                        this.listenTo(viewport, 'meshChanged', function () {
                                                            return this.trigger('meshChanged');
                                                        });
                                                        this.listenTo(viewport, 'meshRemoved', function () {
                                                            return this.trigger('meshRemoved');
                                                        });
                                                        return _.each(viewports, function (m) {
                                                            return this.listenTo(m, 'meshSelected', function () {
                                                                this.selected = m.getSelected();
                                                                return this.trigger('meshSelected');
                                                            });
                                                        }, this);
                                                    },
                                                    addViewport: function (viewport) {
                                                        var viewports;
                                                        viewports = this.get('viewports');
                                                        return viewports.push(viewport);
                                                    },
                                                    getObjects: function () {
                                                        var viewports;
                                                        viewports = this.get('viewports');
                                                        if (viewports) {
                                                            return viewports[0].get('objects');
                                                        } else {
                                                            return [];
                                                        }
                                                    }
                                                });
    EditorView = Backbone.View.extend({
                                          initRenderer: function () {
                                              var renderer;
                                              this.renderer = renderer = new THREE.WebGLRenderer({
                                                                                                     antialias: true,
                                                                                                     precision: 'highp',
                                                                                                     alpha: true,
                                                                                                     preserveDrawingBuffer: true,
                                                                                                     maxLights: 5
                                                                                                 });
                                              renderer.setSize(this.width, this.height);
                                              renderer.setClearColor(0xffffff, 0.1);
                                              // 设置canvas背景色，透明度
                                              return this.el.appendChild(renderer.domElement);
                                          },
                                          initCamera: function () {
                                          },
                                          initProjector: function () {
                                              var cameraChanged, helpersVisible, intersectionPlane, offset, picked, projector, ray, scene, selected, _this;
                                              scene = this.model.get('scene');
                                              // TODO: move these code to Model
                                              intersectionPlane = this.model.get('intersectionPlane');
                                              ray = new THREE.Raycaster();
                                              projector = new THREE.Projector();
                                              offset = new THREE.Vector3();
                                              cameraChanged = false;
                                              helpersVisible = true;
                                              picked = null;
                                              selected = this.camera;
                                              _this = this;
                                              this.$el.mousedown(function (event) {
                                                  var intersects, root, vector;
                                                  _this.el.focus();
                                                  if (!_this.selectionAvailable) {
                                                      return;
                                                  }
                                                  if (event.button === 0) {
                                                      vector = new THREE.Vector3((event.offsetX / _this.width) * 2 - 1, -(event.offsetY / _this.height) * 2 + 1, 0.5);
                                                      projector.unprojectVector(vector, _this.camera);
                                                      ray.set(_this.camera.position, vector.sub(_this.camera.position).normalize());
                                                      intersects = ray.intersectObjects(scene.children, true);
                                                      // objects
                                                      if (intersects.length > 0) {
                                                          if (_this.controls) {
                                                              _this.controls.enabled = false;
                                                          }
                                                          picked = intersects[0].object;
                                                          if (picked.properties.isGizmo) {
                                                              root = picked.properties.gizmoRoot;
                                                              selected = picked.properties.gizmoSubject;
                                                          } else {
                                                              root = picked;
                                                              selected = picked;
                                                          }
                                                          intersectionPlane.position.copy(root.position);
                                                          intersectionPlane.lookAt(_this.camera.position);
                                                          console.log('mouse down: ', selected);
                                                          _this.handleSelected(selected);
                                                          // selected is the mesh your mouse selected
                                                          // TODO dispatch the mousedown event to the selected mesh
                                                          // intersects = ray.intersectObject(intersectionPlane)
                                                          // offset.copy(intersects[ 0 ].point).sub(intersectionPlane.position)
                                                          return _this.mousemoveAvailable = _this.mouseupavailable = true;
                                                      }
                                                  }
                                              });
                                              this.$el.mousemove(function (event) {
                                                  var intersects, vector;
                                                  if (_this.mousemoveAvailable) {
                                                      // do the tasks after mouse down
                                                      vector = new THREE.Vector3((event.offsetX / _this.width) * 2 - 1, -(event.offsetY / _this.height) * 2 + 1, 0.5);
                                                      projector.unprojectVector(vector, _this.camera);
                                                      ray.set(_this.camera.position, vector.sub(_this.camera.position).normalize());
                                                      intersects = ray.intersectObject(intersectionPlane);
                                                      if (intersects.length > 0) {
                                                          intersects[0].point.sub(offset);
                                                          if (picked.properties.isGizmo) {
                                                              picked.properties.gizmoRoot.position.copy(intersects[0].point);
                                                              picked.properties.gizmoSubject.position.copy(intersects[0].point);
                                                              // TODO: use mouse move subject
                                                              console.log('mouse move subject: ', picked.properties.gizmoSubject);
                                                          } else {
                                                              // 移动选中的
                                                              picked.position.copy(intersects[0].point);
                                                              // TODO: use mouse move subject
                                                              console.log('mouse move subject: ', picked.properties.gizmoSubject);
                                                          }
                                                          return _this.update();
                                                      }
                                                  }
                                              });
                                              return this.$el.mouseup(function (event) {
                                                  if (_this.mouseupavailable) {
                                                      _this.mousemoveAvailable = false;
                                                      _this.mouseupavailable = false;
                                                      if (_this.controls !== void 0) {
                                                          return _this.controls.enabled = true;
                                                      }
                                                  }
                                              });
                                          },
                                          handleSelected: function (selected) {
                                              return this.model.trigger('meshSelect', selected);
                                          },
                                          update: function () {
                                              return this.renderOnce();
                                          },
                                          initialize: function () {
                                              this.width = this.options.width;
                                              this.height = this.options.height;
                                              this.selectionAvailable = false;
                                              this.initCamera();
                                              this.initProjector();
                                              this.initRenderer();
                                              this.initEvents();
                                              return this.animate();
                                          },
                                          animate: function () {
                                              return animate(this);
                                          },
                                          renderOnce: function () {
                                              return this.renderer.render(this.model.get('scene'), this.camera);
                                          },
                                          initEvents: function () {
                                              var _camera, _model;
                                              _model = this.model;
                                              _camera = this.camera;
                                              // comment below codes because use TracckballControls.js's control system
                                              // this.$el.bind('mousewheel', (event, delta) ->
                                              // if delta < 0
                                              //       _camera.position.x *= 1.1
                                              //  _camera.position.y *= 1.1
                                              //   _camera.position.z *= 1.1
                                              // else
                                              //   _camera.position.x *= 0.9
                                              //   _camera.position.y *= 0.9
                                              //  _camera.position.z *= 0.9
                                              // )
                                          }
                                      });
    Editor2DView = EditorView.extend({
                                         initCamera: function () {
                                             var aspect, camera, far, near, view_angle;
                                             view_angle = 100;
                                             aspect = this.width / this.height;
                                             near = 1.0;
                                             far = 5000;
                                             this.camera = camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
                                             camera.position.set(0, 0, 500);
                                             camera.rotation.set(-1.57, 0, 0);
                                             camera.up.set(0, 0, 1);
                                             return camera.lookAt(this.model.get('scene').position);
                                         },
                                         initEvents: function () {
                                             var _camera, _model;
                                             _model = this.model;
                                             _camera = this.camera;
                                             return this.$el.bind('mousewheel', function (event, delta) {
                                                 if (delta < 0) {
                                                     _camera.position.x *= 1.1;
                                                     _camera.position.y *= 1.1;
                                                     return _camera.position.z *= 1.1;
                                                 } else {
                                                     _camera.position.x *= 0.9;
                                                     _camera.position.y *= 0.9;
                                                     return _camera.position.z *= 0.9;
                                                 }
                                             });
                                         }
                                     });
    Editor3DView = EditorView.extend({
                                         initialize: function () {
                                             return EditorView.prototype.initialize.apply(this, arguments);
                                         },
                                         initCamera: function () {
                                             var aspect, camera, controls, far, near, view_angle;
                                             view_angle = 50;
                                             aspect = this.width / this.height;
                                             near = 1.0;
                                             far = 5000;
                                             this.camera = camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
                                             camera.position.set(500, 1500, 500);
                                             camera.rotation.set(-0.46, 0.73, 0.32);
                                             camera.up.set(0, 0, 1);
                                             camera.lookAt(this.model.get('scene').position);
                                             this.controls = controls = new THREE.TrackballControls(camera, this.el);
                                             return controls.enabled = true;
                                         },
                                         initEvents: function () {
                                         },
                                         animate: function () {
                                             return editor3dviewanimate(this);
                                         }
                                     });
    SceneMeshsView = Backbone.View.extend({
                                              initialize: function () {
                                                  this.items = [];
                                                  this.listenTo(this.model, 'meshAdded meshChanged meshRemoved', this.render);
                                                  this.listenTo(this.model, 'meshSelected', this.handleSelected);
                                                  return this.render();
                                              },
                                              handleSelected: function () {
                                                  var founded, item, selected, _i, _len, _ref;
                                                  selected = this.model.selected;
                                                  founded = false;
                                                  _ref = this.items;
                                                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                                      item = _ref[_i];
                                                      if (item.obj === selected || (selected.name !== '' && item.obj.name === selected.name)) {
                                                          item.$el.addClass('active');
                                                          founded = true;
                                                      } else {
                                                          item.$el.removeClass('active');
                                                      }
                                                  }
                                                  if (!founded && this.items.length > 0) {
                                                      return this.items[0].$el.addClass('active');
                                                  }
                                              },
                                              render: function () {
                                                  var i, item, listView, obj, objects, panel, str, _i, _ref;
                                                  objects = this.model.getObjects();
                                                  this.items = [];
                                                  panel = this.$(".meshs-list-panel");
                                                  listView = $("<ul></ul>");
                                                  listView.addClass('meshs-list');
                                                  for (i = _i = 0, _ref = objects.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                                                      obj = objects[i];
                                                      str = '<li>' + (obj.meshType ? obj.meshType : 'Object3D') + ': ' + (obj.name ? obj.name : _.uniqueId('object3d')) + '</li>';
                                                      item = $(str);
                                                      this.items.push({
                                                                          obj: obj,
                                                                          el: item[0],
                                                                          $el: item
                                                                      });
                                                      if (i === 0) {
                                                          item.addClass('active');
                                                      }
                                                      listView.append(item);
                                                  }
                                                  panel.html('');
                                                  return panel.append(listView);
                                              }
                                          });
    animate = function (view) {
        requestAnimationFrame(function () {
            return animate(view);
        });
        return view.update();
    };
    editor3dviewanimate = function (view) {
        requestAnimationFrame(function () {
            return editor3dviewanimate(view);
        });
        view.update();
        return view.controls.update();
    };
    if (window.editor === void 0) {
        window.editor = {};
    }
    editor = window.editor;
    window.viewport2d = viewport2d = new EditorViewport({
                                                            name: 'viewport2d'
                                                        });
    window.viewport3d = viewport3d = new EditorViewport({
                                                            name: 'viewport3d'
                                                        });
    viewportProxy = new EditorViewportProxy;
    viewport2d.addToProxy(viewportProxy);
    viewport3d.addToProxy(viewportProxy);
    viewportProxy.startListen();
    viewportProxy.loadScene(static_url + 'resources/scenes/test.json');
    width = $(".editor_panel").width();
    height = $(".editor_panel").height();
    editor2dview = new Editor2DView({
                                        el: $(".edit_area"),
                                        model: viewport2d,
                                        width: width,
                                        height: height
                                    });
    editor3dview = new Editor3DView({
                                        el: $(".view_area"),
                                        model: viewport3d,
                                        width: width,
                                        height: height
                                    });
    editor['view2d'] = editor2dview;
    editor['view3d'] = editor3dview;
    window.sceneMeshsView = new SceneMeshsView({
                                                   el: $(".scene.panel .scene-panel"),
                                                   model: viewportProxy
                                               });
    // init dom events
    $(document).on('click', '.addToScene', function () {
        var $_this, type, url;
        $_this = $(this);
        type = $_this.attr('data-type');
        url = $_this.attr('data-url');
        if (_.indexOf(['wall'], type) >= 0) {
            return helper.getJSON(url, function (json) {
                return viewportProxy.despatchMeshJson(helper.preprocessJsonResource(json, 'wall'));
            });
        }
    });
});
