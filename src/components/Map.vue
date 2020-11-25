<template style="overflow: hidden">
<!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->

  <v-container fluid grid-list-md fill-height style="padding: 0px;">
    <v-layout row wrap style="padding: 0px;">

      <v-flex fill-height ma-0 pa-0>

        <!------------ Start dialog ------------>
        <v-dialog v-model="startDialog" max-width="800">
          <v-card>
            <v-card-title class="headline">
              <img style="width: 155px;" src="../assets/logo_titulo.png" alt="">
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <Dialog/>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" dark small @click="startDialog = false">
                Got it!
              </v-btn>
             </v-card-actions>
           </v-card>
        </v-dialog>
        <!------------ Start dialog end ------------>

        <v-toolbar color="white" xs12 tabs  height="58px" style="position: absolute; z-index: 10; border-bottom: 4px solid #098837 !important;">
          <v-toolbar-title>
            <img style="width: 140px;" src="http://www.euxdat.eu/wp-content/uploads/2017/12/logo_1-1.png" alt="">
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <span style="color:#27304c">
            <v-icon>person</v-icon> <span v-if="!$vuetify.breakpoint.smAndDown">{{user.name}}</span>
          </span>
          <v-btn icon title="Exit app" @click="logout()">
            <v-icon color="#27304c">exit_to_app</v-icon>
          </v-btn>
        </v-toolbar>


        <v-flex id="map" style="max-height: 100vh; height: 100vh; padding: 0px; margin: 0px;">

          <!------------ Zoom controls and layer manager start ------------>
          <div class="flex xs12 sm4 md3 lg2" style="position: absolute; z-index: 10; top:80px; right: 10px;">
            <v-layout row wrap>
              <v-flex xs12 pl-2 row>

                <v-btn-toggle multiple>
                  <v-btn flat class="v-btn--active" title="Zoom in" @click="zoomMap(map, 'in')" style="background-color: #47a34b; color: white;">
                    <v-icon>add</v-icon>
                  </v-btn>
                  <v-btn flat class="v-btn--active" title="Zoom out" @click="zoomMap(map, 'out')" style="background-color: #47a34b; color: white;">
                    <v-icon>remove</v-icon>
                  </v-btn>
                </v-btn-toggle>
                <!--
                <v-btn dark color="#2c4a48" style="margin-top: 0px; left: 10px; bottom: 5px;">
                  <v-icon dark>3d_rotation</v-icon>
                </v-btn>
                -->
                <div class="" style="background-color: white; padding-left: 10px; padding-right: 10px;">
                  <v-radio-group v-model="selectedBaseLayer" :mandatory="false" v-on:change="setLayerVisibility(map)" style="padding-top: 14px;">
                    <v-radio color="#47a34b" label="Open Street Map" value="osm"></v-radio>
                    <v-radio color="#47a34b" label="Aerial" value="aerial" ></v-radio>
                  </v-radio-group>
                </div>

              </v-flex>
            </v-layout>
          </div>
          <!------------ Zoom controls and layer manager end ------------>

          <!------------ Service form start ------------>
          <div class="flex xs12 sm4 md3 lg3 xl2" style="position: absolute; z-index: 10; top:80px; left: 10px; background-color: #27304c;">
            <v-toolbar class="green" tabs  height="42px">
              <v-toolbar-title>
                <img style="width: 30px;" src="../assets/logo_1-1.png" alt="">
                <span style="font-size: 16px;">Agroclimatic zones</span>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="startDialog = true" title="More info">
                <v-icon color="#27304c">info</v-icon>
              </v-btn>
            </v-toolbar>

            <div style="background-color: white; padding-left: 10px; padding-right: 10px;">

              <v-form ref="form" v-model="isValid" style="margin-top: 10px; margin-bottom: 5px; text-size: 10px;" lazy-validation >
                <v-layout row wrap style="text-align: left; padding-top: 8px;">

                  <v-flex xs12 pl-2 row>
                    <v-layout row wrap>
                      <v-flex sm12 xs12 md6>
                        <v-combobox
                          v-model="selectedPolygon"
                          :items="userPolygons.features"
                          item-text="properties.culture"
                          item-value="properties.pk"
                          label="Select a polygon"
                          v-on:change="zoomToPolygon(map, selectedPolygon.properties.pk)"
                          color="green"
                          :disabled="isOutput"
                        ></v-combobox>

                      </v-flex>

                      <v-flex sm12 xs12 md6>
                        <v-layout row wrap>
                          <v-btn flat icon color="green" v-if="isSelected" :disabled="isDrawing || isOutput"
                            style="margin: 6px 2px; width: 25px;" @click="zoomToPolygon(map, selectedPolygon.properties.pk)" title="Zoom to polygon">
                            <v-icon>zoom_in</v-icon>
                          </v-btn>
                          <v-btn flat icon color="green" v-if="isSelected" :disabled="isDrawing || isOutput"
                            style="margin: 6px 2px; width: 25px;" @click="dialogDeletePolygon = true" title="Delete selected polygon">
                            <v-icon>delete</v-icon>
                          </v-btn>
                          <v-btn flat icon color="#27304c" :disabled="isOutput" style="margin: 6px 2px; width: 25px;"
                            @click="drawPolygon(map)" title="Create new polygon">
                            <v-icon>add_circle_outline</v-icon>
                          </v-btn>
                        </v-layout>
                      </v-flex>
                    </v-layout>

                    <v-divider style="margin-bottom: 10px;"></v-divider>
                  </v-flex>

                  <v-flex xs12 pl-2 row>
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-text-field :disabled="isDrawing || isOutput" dense color="#77b942" type="number" v-model="start_hour_day" :value="start_hour_day"
                        label="Start hour *" :rules="inputNumRules" required></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field :disabled="isDrawing || isOutput" color="#77b942" type="number" v-model="end_hour_day" :value="end_hour_day"
                        label="End hour *" :rules="inputNumRules" required></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  <v-flex xs12 pl-2 row>
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-text-field :disabled="isDrawing || isOutput" dense color="#77b942" type="number" v-model="start_year" :value="start_year"
                        label="Start year *" :rules="inputNumRules" required></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field :disabled="isDrawing || isOutput" color="#77b942" type="number" v-model="end_year" :value="end_year"
                        label="End year *" :rules="inputNumRules" required></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  <v-flex xs12 pl-2 row>
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-text-field :disabled="isDrawing || isOutput" dense color="#77b942" type="number" v-model="day_in_row" :value="day_in_row"
                        label="Day in row *" :rules="inputNumRules" required></v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field :disabled="isDrawing || isOutput" color="#77b942" type="number" v-model="frost_degree" :value="frost_degree"
                        label="Frost degree *" :rules="inputNumRules" required></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  <v-flex xs12 pl-2 row>
                    <v-layout row wrap>
                      <v-flex xs6>
                        <v-text-field :disabled="isDrawing || isOutput" color="#77b942" suffix="%" type="number" v-model="probability" :value="probability"
                        label="Probability *" :rules="inputNumRules" required></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  <v-flex xs12 sm12 md12 lg12>
                    <small v-if="!isOutput">* Indicates required field</small>
                    <v-divider ></v-divider>
                  </v-flex>

                  <v-flex xs12 sm12 md12 lg12 v-if="!isSelected && !isOutput" class="green panel-chip">
                    <span color="#4ba64f" label>Please select a polygon to start the service.</span>
                  </v-flex>

                  <v-flex xs12 sm12 md12 lg12 v-if="isOutput" class="panel-chip" style="background-color: #294247; color: white;">
                    <span color="#4ba64f" label>Press "start" to remove outputs.
                      <v-btn small flat dark @click="resetFrom()" title="Re-launch service">
                        start
                      </v-btn>
                    </span>
                  </v-flex>

                  <v-flex xs12 sm12 md12 lg12 v-if="!isOutput && isSelected" class="text-xs-right" style="padding: 0px; margin-bottom: 5px;">
                    <v-btn small round color="#27304c" dark @click="runService()" title="Run service" >
                      RUN
                    </v-btn>
                  </v-flex>

                  <!-- Button to test the output JSON
                  <v-btn small round color="#27304c" dark @click="getGeojson()" title="Run service" >
                    TEST
                  </v-btn>
                  -->
                </v-layout>
              </v-form>

            </div>
          </div>
          <!------------ Service form end ------------>

          <!------------ Output panel start ------------>
          
          <v-flex xs12 sm2 md2 lg2 v-if="outputPanel" style="position: absolute; z-index: 10; top:260px; right: 10px; max-height: 350px">
            <v-flex xlg4 offset-xlg8 lg9 offset-lg3 md12 sm12 style=" background-color: #27304c;">
              <v-toolbar class="green pa-0 ma-0" tabs height="35px" style="padding:0px;">
                <v-toolbar-title class="pa-0 ma-0">

                  <v-btn icon class="ma-0" title="Download GeoJSON" @click="downloadGeoJSON()">
                    <v-icon color="#27304c">archive</v-icon>
                  </v-btn>

                  <span style="color:#27304c; font-size: 16px;">
                    Outputs
                  </span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon title="Close output panel" @click="outputPanel = false">
                  <v-icon color="#27304c">clear</v-icon>
                </v-btn>
                
              </v-toolbar>

              <div style="background-color: white; padding-left: 10px; padding-right: 10px; padding-bottom: 10px; margin-top: 5px; height: 400px; overflow-y: scroll;">
                <v-layout row wrap style="margin-top: 5px;">

                  <v-flex xs12 row v-for="(value, key) in outputGeojson" v-bind:key="value"  style="padding-top: 5px; padding-bottom: 5px; ">
                    <span v-if="key != 'geometry'">
                      <v-layout row wrap style="font-size: 12px; ">
                      <v-flex xs6 sm6>                     
                        <span class="caption grey--text" style="margin-right: 4px;">{{ key }}: </span>                            
                      </v-flex>
                      <v-flex xs6 sm6 style="text-align: right;">
                          {{ value }}
                      </v-flex>
                        </v-layout>
                    </span>
                  </v-flex>

                </v-layout>
              </div>
            </v-flex>
          </v-flex> 
          <!------------ Output panel end ------------>

          <!------------ Alert start ------------>
          <div class="flex xs3" style="left: 10px; bottom: 10px; position: absolute; z-index: 10;" >
            <v-alert :value="isAlert" :type="alertType" dismissible transition="scale-transition">
               {{alertMsg}}
            </v-alert>
          </div>
          <!------------ Alert end ------------>

        </v-flex>
      </v-flex>

      <!------------ New polygon dialog start ------------>
      <v-dialog v-model="dialogAddPolygon" persistent max-width="290">

        <v-card>
          <v-card-title class="headline">
              <img style="width: 120px;" src="../assets/logo_titulo.png" alt="">
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text style="padding-bottom: 0px;">

            <span  style="color: #37aa48; font-size 14px; font-weight: bold; margin-bottom: 10px;">
              Please type a name for the new polygon:
            </span>

            <v-form ref="formNew" style="margin-top: 15px;" lazy-validation>
              <v-layout row wrap>
                <v-flex xs8 offset-xs2>
                  <v-text-field color="#77b942" :counter="15" v-model="newPolygonName"
                    label="Name *" :rules="inputNewRules" required ></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs12 sm12 md12 lg12>
                  <small>* Indicates required field</small>
                </v-flex>
              </v-layout>
            </v-form>

          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small dark round color="#27304c" @click="savePolygon()" title="Save new polygon">
              Save
            </v-btn>
           </v-card-actions>
         </v-card>

      </v-dialog>
      <!------------ New polygon dialog end ------------>

      <!------------ Delete polygon dialog start ------------>
      <v-dialog v-model="dialogDeletePolygon" persistent max-width="290">

        <v-card>
          <v-card-title class="headline">
            <img style="width: 120px;" src="../assets/logo_titulo.png" alt="">
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text style="text-align: center;">
            <span style="color: #37aa48; font-size 14px; font-weight: bold; margin-bottom: 10px;">
              Are you sure to remove the polygon?
            </span><br>
            <span v-if="selectedPolygon.properties">
              {{selectedPolygon.properties.culture}}
            </span>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn small flat color="#27304c" @click="dialogDeletePolygon = false" title="Cancel">
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn small dark round color="#27304c" @click="removePolygon(map)" title="Delete polygon">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>
      <!------------ Delete polygon dialog end ------------>

      <!------------ Progress dialog start ------------>
      <v-dialog v-model="isRunning" persistent max-width="180">

        <v-card>
          <v-card-text style="text-align: center;">
            <img style="width: 120px;" src="../assets/logo_titulo.png" alt="">

            <v-progress-circular :size="60" :width="7" color="green" indeterminate style="margin-top: 15px;"></v-progress-circular>

            <v-flex xs12 style="color: #37aa48; font-size 12px; margin-bottom: 10px; margin-top: 10px;">
              Processing...
            </v-flex>
          </v-card-text>
        </v-card>

      </v-dialog>
      <!------------ Progress dialog end ------------>

    </v-layout>
  </v-container>

</template>

<script>

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import BingMaps from 'ol/source/BingMaps.js';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import {Draw, Select} from 'ol/interaction.js';
import {Fill, Stroke, Style, Circle} from 'ol/style.js';
import OSM from 'ol/source/OSM';
//import {defaults} from 'ol/control';
import Dialog from '@/components/Dialog.vue'

import Geocoder from 'ol-geocoder/dist/ol-geocoder.js';

import CONST from "../const";

export default {
  name: 'Map',
  components: {
    Dialog
  },
  data: () => ({
    dbURL: CONST.dbURL,
    cloudifyURL: CONST.cloudifyURL,
    apacheURL: CONST.apacheURL,
    authHeader: CONST.authHeader,
    startDialog: true,
    deploymentName: "",
    valid: false,
    day_in_row: "1",
    start_hour_day: "0",
    end_hour_day: "23",
    frost_degree: "0",
    start_year: "2016",
    end_year: "2018",
    probability: "10",
    isValid: false,
    inputNumRules: [
     //v => !!v || 'Required field',
     v => (v && /^\d+(\.\d{1,20})?$/.test(v)) || ''
    ],
    inputNewRules: [
      v => ((v || '').length <= 15) && !!v  || ''
    ],
    interactionSelect: null,
    outputGeojson: {},
    userPolygons: [],
    selectedPolygon: "",
    isSelected: false,
    dialogAddPolygon: false,
    newPolygon: {},
    newPolygonName: "New polygon",
    dialogDeletePolygon: false,
    isDrawing: false,
    polygonBBOX: [],
    outputPanel: false,
    isRunning: false,
    isOutput: false,
    defaultStyle: {},
    selectedStyle: {},
    isAlert: false,
    alertMsg: "",
    alertType: "error",
    selectedBaseLayer: 'osm',
    downloadURL: "",
  }),
  watch: {
  },
  methods: {
    /**
    * Initialize Map, base layer, styles and select interaction
    *
    * @public
    */
    initMap(){
      var self = this;
      this.defaultStyle = new Style({
        stroke: new Stroke({
          color: 'yellow',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0)'
        })
      });
      this.selectedStyle = [
        new Style({
          stroke: new Stroke({
            color: 'red',
            width: 3
          }),
          fill: new Fill({
            color: 'rgba(0, 0, 0, 0)'
          })
        })
      ];

      //Aerial layer
      var aerialLayer =  new TileLayer({
        visible: true,
        preload: Infinity,
        name: 'aerial',
        source: new BingMaps({
          key: 'AgbuLm2QSg5-rZyOrydftTOzC7z5pYY82q4By3PgFoKhPxNSrrcf1JFs1yoJXJIp',
          imagerySet: 'Aerial',
          maxZoom: 19
        })
      });

      var drawLayer = new VectorLayer({
        source: new VectorSource({wrapX: false}),
        name: 'userPolygonsLayer',
        style: self.defaultStyle
      });
      drawLayer.setZIndex(98)

      var myMap = new Map({
        target: 'map',
        layers: [
          aerialLayer,
          drawLayer,
          new TileLayer({
            name: 'osm',
            source: new OSM()
          })
        ],
        //controls: [],
        view: new View({
          projection: 'EPSG:3857', 
         // center: [1342883.931428, 6145995.696298], //[12.14, 48.51],
         // extent: [1335833.89, 6106854.83, 1558472.87, 6621293.72],
          center: [1607623.578894, 6462139.245285], //[12.14, 48.51],
          extent: [1331553.67, 6200020.3, 2084834.79, 6629111.17],
          zoom: 12,
          minZoom: 12,
        })
      });

      aerialLayer.setVisible(false);

      this.interactionSelect = new Select();
      myMap.addInteraction(this.interactionSelect);

      this.interactionSelect.on('select', function(e) {
        e.target.getFeatures().forEach(function(f){

          if(!f.getProperties().culture && !self.isDrawing){
            self.outputGeojson = f.getProperties();
            if(self.isOutput){
              self.outputPanel = true;
            }
          }else{
            f.setStyle(self.defaultStyle);
          }
        })
      });

      this.initGeocoder(myMap);
      this.map = myMap;
    },//initMap
    /**
    * Init the geocoder control
    *
    * @param {object} map
    * @public
    */
    initGeocoder(map){

      var geocoder = new Geocoder('nominatim', {
        provider: 'osm',
        lang: 'en',
        placeholder: 'Search for ...',
        targetType: 'text-input',
        limit: 5,
        debug: true,
        autoComplete: true,
        keepOpen: false,
        preventDefault : true
      });
      map.addControl(geocoder);

      geocoder.on('addresschosen', function(evt){
        map.getView().fit([evt.coordinate[0], evt.coordinate[1], evt.coordinate[0], evt.coordinate[1]]);
        map.getView().setZoom(16);
      });

    },//initGeocoder
    /**
    * zoom map controls
    *
    * @param {object} map
    * @param {string} op
    * @public
    */
    zoomMap(map, op){
      var zoom = map.getView().getZoom();

      if(op === "in"){
        map.getView().setZoom(zoom + 1)
      }else{
        map.getView().setZoom(zoom - 1)
      }

    },//zoomInMap
    /**
    * Controls the base layers visibility
    *
    * @param {object} map
    * @public
    */
    setLayerVisibility(map){
      var self = this;
      if(this.selectedBaseLayer === 'osm'){
        self.getLayerFromMapByName(map, 'aerial').setVisible(false);
        self.getLayerFromMapByName(map, 'osm').setVisible(true);
      }else{
        self.getLayerFromMapByName(map, 'aerial').setVisible(true);
        self.getLayerFromMapByName(map, 'osm').setVisible(false);
      }
    },//setLayerVisibility
    /**
    * Get all the user polygons and add them to the map
    *
    * @param {boolean} isInit
    * @public
    */
    getUserLayers(isInit){      
      var url = this.dbURL.concat(this.user.preferred_username,
        '/fields/epsg/3857/geojson');

      this.$http.get(url).then(response => {
        if(!isInit){
          this.getLayerFromMapByName(this.map, 'userPolygonsLayer').getSource().clear();
          this.userPolygons = [];
        }
        this.userPolygons = response.body;
        this.getLayerFromMapByName(this.map, 'userPolygonsLayer').getSource()
          .addFeatures((new GeoJSON()).readFeatures(response.body))

        }, response => {
          this.showAlert("error", response.statusText);
      });
    },//getUserLayers
    /**
    * Zoom to selected polygon and get their BBOX
    *
    * @param {object} map
    * @param {int} pk
    * @public
    */
    zoomToPolygon(map, pk){

      var self = this;
      var feature;
      var layer = this.getLayerFromMapByName(map, 'userPolygonsLayer');
      this.isSelected = true;

      layer.getSource().getFeatures().forEach(function(fea){
        if(fea.getProperties().pk === pk){
          map.getView().fit(fea.getGeometry());
          feature = fea;
        }else{
          fea.setStyle(self.defaultStyle);
        }
      });

      feature.setStyle(this.selectedStyle)
      this.interactionSelect.getFeatures().push(feature);
      this.polygonBBOX = feature.getGeometry().getExtent();

    },//zoomToPolygon
    /**
    * Create a new polygon
    *
    * @param {object} map
    * @public
    */
    drawPolygon(map){
      var draw;
      var self = this;
      var layer = this.getLayerFromMapByName(map, 'userPolygonsLayer');
      this.isDrawing = true;

      this.interactionSelect.getFeatures().clear();

      draw = new Draw({
        source: layer.getSource(),
        type: 'Polygon'
      });

      map.addInteraction(draw);

      draw.on('drawend', function (event) {
        self.polygonBBOX = event.feature.getGeometry().getExtent();
        self.newPolygon = event.feature;
        map.removeInteraction(draw);
        self.isDrawing = false;
        self.dialogAddPolygon = true;
      });

    }, //drawPolygon
    /**
    * Save polygon in the database
    *
    * @public
    */
    savePolygon(){

      var self = this;
      var url = this.dbURL.concat(this.user.preferred_username,
        '/fields/add');

      var geoJSON =
        {
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:3857'
          }
        },
        'features': [{
          'type': 'Feature',
          'properties': {"culture": self.newPolygonName, "olu_id": 24},
          'geometry': {
            'type': 'Polygon',
            'coordinates': this.newPolygon.getGeometry().getCoordinates()
            }
          }]
        }

      if(this.$refs.formNew.validate()){
        this.$http.post(url, geoJSON).then(response => {
          self.getUserLayers(false);
          self.dialogAddPolygon = false;
          self.interactionSelect.getFeatures().clear();
          self.newPolygonName = "New polygon";
          self.showAlert("success", response.statusText);
        }, response => {
          self.showAlert("error", response.statusText);
        });
      }

    },//savePolygon
    /**
    * Delete the polygon from the DB and remove it from map
    *
    * @param {object} map
    * @public
    */
    removePolygon(map){
      var self = this;
      var pk = this.selectedPolygon.properties.pk;
      var lyr = this.getLayerFromMapByName(map, 'userPolygonsLayer');
      var url = this.dbURL.concat(this.user.preferred_username,
        '/fields/', pk, '/delete');

      this.$http.get(url).then(response => {

        lyr.getSource().getFeatures().forEach(function(fea){
          if(fea.getProperties().pk === pk){
            lyr.getSource().removeFeature(fea);
          }
        });
        self.showAlert("success", response.statusText);

        self.dialogDeletePolygon = false;
        self.getUserLayers(false);
        self.selectedPolygon = "";
        self.interactionSelect.getFeatures().clear();
        self.isSelected = false;

        }, response => {
          self.showAlert("error", response.statusText);
      });

    },//removePolygon
    /**
    * Create a new deployment and install it
    *
    * @public
    */
    runService(){

        var self = this;
        this.isRunning = true;
        this.deploymentName = this.user.preferred_username.slice(2) + '-' + Date.now().toString();
        var url = this.cloudifyURL.concat("deployments/", this.deploymentName);

        var headers = {
          'Authorization': this.authHeader,
          'Tenant': 'default_tenant'  ,
          'Content-Type': 'application/json'
        };

        var body = {
         "blueprint_id":"agroclimatic_frostdates_epsg",
         "inputs": {
           "epsg_string": "epsg:3857",
           "username": this.user.preferred_username,
           "process_id": this.deploymentName,
           "day_in_row": this.day_in_row,
           "start_hour_day": this.start_hour_day,
           "end_hour_day": this.end_hour_day,
           "frost_degree": this.frost_degree,
           "start_year": this.start_year,
           "end_year": this.end_year,
           "probability": this.probability,
           "start_lon": this.polygonBBOX[0].toString(),
           "start_lat": this.polygonBBOX[1].toString(),
           "end_lon": this.polygonBBOX[2].toString(),
           "end_lat": this.polygonBBOX[3].toString()
          }
        };

        if(this.$refs.form.validate()){
          this.$http.put(url, body, {headers}).then(response => {
            url = this.cloudifyURL.concat("executions");
            body = {
              "deployment_id": this.deploymentName,
              "workflow_id": "install"
            };

            setTimeout(function(){
              self.$http.post(url, body, {headers}).then(response => {

                setTimeout(function(){
                  self.getExecutionStatus(response.body.deployment_id);
                }, 5000);
                  self.showAlert("success", response.statusText);
              }, response => {
                self.showAlert("error", response.statusText);
              });
            }, 5000);
            self.showAlert("success", response.statusText);
            }, response => {
              self.showAlert("error", response.statusText);
          });
      }

    },//runService
    /**
    * Check the running status, if is "terminated" triggerd getGeojson() method
    *
    * @param {string} id
    * @public
    */
    getExecutionStatus(id){

      var self = this;
      var url = this.cloudifyURL.concat("deployments/", id, "/outputs");
      var headers = {
        'Authorization': this.authHeader,
        'Tenant': 'default_tenant'
      };

      this.$http.get(url, {headers}).then(response => {

        if(response.body.outputs.agroclimatic_frostdate_status === null){
          setTimeout(function(){
            self.getExecutionStatus(id);
          }, 3000);
        }else if (response.body.outputs.agroclimatic_frostdate_status[0].state.terminated === null){
          setTimeout(function(){
            self.getExecutionStatus(id);
          }, 5000);
        }else{
          if(response.body.outputs.agroclimatic_frostdate_status[0].state.terminated.reason === "Completed"){
            self.getGeojson();
          }else{
            self.resetFrom();
            self.isRunning = false;
            self.showAlert("error", "Failed generating the output GeoJSON");
          }
        }

        }, response => {
          self.showAlert("error", response.statusText);
      });

    },//getExecutionStatus
    /**
    * Get the GeoJSON generated by the service
    *
    * @public
    */
    getGeojson(){

      var self = this;
      var url = this.apacheURL.concat(this.user.preferred_username, '/frostdates/', this.deploymentName, '.geojson');

      var headers = {
        'Authorization': this.authHeader,
        'Tenant': 'default_tenant'
      };

      this.$http.get(url, {headers}).then(response => {

        if(response.body.toString().length === 45){
          self.showAlert("error", "No output data generated, try a bigger area");
          self.resetFrom();
          this.isRunning = false;
        }else{
          self.drawOutput(response.body);
          self.downloadURL = url;
        }
      }, response => {
        self.showAlert("error", response.statusText);
      });
    },//getGeojson
    /**
    * Get the GeoJSON and add to the map, also set the style and zoom in
    * the selected polygon
    *
    * @param {json} geojson
    * @public
    */
    drawOutput(geojson){

      var vectorSource = new VectorSource({
        features: (new GeoJSON()).readFeatures(geojson)
      });

      var vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({color: 'blue'}),
            stroke: new Stroke({
              color: 'red',
              width: 3
            })
          })
        })
      });

      vectorLayer.set('name', 'output');
      this.map.addLayer(vectorLayer);
      vectorLayer.setZIndex(99)
      this.isRunning = false;
      this.isOutput = true;
      this.map.getView().fit(this.polygonBBOX);

    },//drawOutput
    /**
    * Open a new tab in the explorer to download the output
    *
    * @public
    */
    downloadGeoJSON(){
      window.open(this.downloadURL, '_blank');
    },//downloadGeoJSON
    /**
    * Reset the form, clear layer selection and remove the output layer form map
    *
    * @public
    */
    resetFrom(){
      this.isRunning = false;
      this.isOutput = false;
      this.outputPanel = false;
      this.interactionSelect.getFeatures().clear();
      this.map.removeLayer(this.getLayerFromMapByName(this.map, 'output'));

      this.day_in_row = "1";
      this.start_hour_day = "0";
      this.end_hour_day = "23";
      this.frost_degree = "0";
      this.start_year = "2016";
      this.end_year = "2018";
      this.probability = "10";

    },//resetFrom
    /**
    * Get the map layer by name and return it as a OL layer object
    *
    * @param {object} map
    * @param {string} name
    * @return {object}
    * @public
    */
    getLayerFromMapByName(map, name){
      var layer;
      map.getLayers().forEach(function(lyr) {
        if(lyr.get('name') === name){
          layer = lyr;
        }
      });
      return layer;
    },//getLayerFromMapByName
    /**
    * Create an alert with custom message
    *
    * @param {string} type
    * @param {string} msg
    * @public
    */
    showAlert(type, msg){
      var self = this;
      this.isAlert = true;
      this.alertMsg = msg;
      this.alertType = type;
      setTimeout(function(){ self.isAlert = false; }, 8000);
    },//showAlert
    /**
    * Logout the application using the Keycloak JavaScript adapter
    *
    * @public
    */
    logout: function(){
      this.$keycloak.logoutFn();
    }//logout
  },
  mounted: function(){
    this.initMap();
    this.getUserLayers(true);
  },
  created(){
    var user = JSON.parse(window.atob(this.$keycloak.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    this.user = user;
  },
  filters: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

p {
	font-size: 14px !important;
	margin: 0 0 10px;
  font-family: Roboto,Helvetica,Arial,sans-serif !important;
	font-weight: 300 !important;
	line-height: 1.5em !important;
}

.h1, .h2, .h3, .h4, body, h1, h2, h3, h4, h5, h6 {
	font-family: Roboto,Helvetica,Arial,sans-serif !important;
}

.header-top {
	background: #1e2f4d;
	min-height: 35px;
	border-bottom: 4px solid #37aa48;
	color: #FFF;
	font-size: 12px;
	padding: 8px 0;
}

/*form*/
.v-input {
	font-size: 12px;
	text-align: left;
}
.v-text-field {
	padding-top: 0px;
	margin-top: 4px;
}

.v-btn--small {
	font-size: 12px;
	height: 20px;
	padding: 0 8px;
  min-width: 58px;
}

.panel-chip {
  padding: 0px;
  text-align: center;
  margin: 5px;
  padding: 2px;
  border-radius: 2px;
  justify-content:
  space-between;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
}

/*Gradient color*/
.green {
	background: linear-gradient(60deg,#66bb6a,#43a047) !important;
	-webkit-box-shadow: 0 12px 20px -10px rgba(76,175,80,.28),0 4px 20px 0 rgba(0,0,0,.12),0 7px 8px -5px rgba(76,175,80,.2) !important;
	box-shadow: 0 12px 20px -10px rgba(76,175,80,.28),0 4px 20px 0 rgba(0,0,0,.12),0 7px 8px -5px rgba(76,175,80,.2) !important;
}

</style>
