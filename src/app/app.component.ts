import {Component, OnInit} from '@angular/core';
import {SafeResourceUrl, DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  title = 'kibana API demo';

  //url for dev
  //url = "https://localhost:5601/rey/app/kibana#/dashboard?embed=true&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(filters:!(),options:(darkTheme:!f),panels:!(),query:(query_string:(analyze_wildcard:!t,query:'*')),timeRestore:!f,title:plugin,uiState:(),viewMode:view)";

  //url for dev version 6.0.0
  url = "http://localhost:5601/rey/app/kibana#/dashboard?embed=true&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(filters:!(),options:(darkTheme:!f),panels:!(),query:(query_string:(analyze_wildcard:!t,query:'*')),timeRestore:!f,title:plugin,uiState:(),viewMode:view)";

  //url for not dev
  //url = "http://localhost:5601/app/kibana#/dashboard?embed=true&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(filters:!(),options:(darkTheme:!f),panels:!(),query:(query_string:(analyze_wildcard:!t,query:'*')),timeRestore:!f,title:plugin,uiState:(),viewMode:view)";

  //url for kibana version 5.3.0
  //url = "https://localhost:5601/rey/app/kibana#/dashboard/create?embed=true&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(filters:!(),options:(darkTheme:!f),panels:!(),query:(query_string:(analyze_wildcard:!t,query:'*')),timeRestore:!f,title:plugin,uiState:(),viewMode:view)";
  private _iframeUrl: string = this.url;

  private _iframeSafeUrl: SafeResourceUrl;
  private _iframeElement: any;
  private _iframeWindow: any;
  private _elasticIndex: string = "logstash-*";
  private _text: string = "";
  private showVis: boolean = false;
  editCreateDash: boolean = false;
  // CreateDashCode: string = " <code >\n" +
  //   "      x = 5;<br>\n" +
  //   "      y = 6;<br>\n" +
  //   "      z = x + y;\n" +
  //   "    </code>";

  CreateDashCode: string = " //Define visualization object\n" +
    "\n" +
    "    //Set visualiztion ID\n" +
    "    let visPartial = {id: \"bytes\"};\n" +
    "\n" +
    "    //Set isFullState to false meaning: the programmer pass minimal defenetion attributes\n" +
    "    visPartial[\"isFullState\"] = false;\n" +
    "\n" +
    "    //Set the elasticsearch index where the data store\n" +
    "    visPartial[\"visIndex\"] = this.elasticIndex;\n" +
    "\n" +
    "    //Set minimal attributes of the visualization, in this example, create pie visualization on the field bytes\n" +
    "    visPartial[\"visState\"] = {visType: 'pie', field: 'bytes', \"title\": \"accc\"};\n" +
    "\n" +
    "      visPartial[\"visDashboardDefenetion\"] = {\n" +
    "        col: 1,\n" +
    "        id: \"bytes\",\n" +
    "        panelIndex: 9,\n" +
    "        row: 1,\n" +
    "        size_x: 3,\n" +
    "        size_y: 3,\n" +
    "        type: \"visualization\"\n" +
    "      };\n" +
    "    this.callPlugin({actionType: \"setVisualization\", visDefenetion: [visPartial]});\n"


  get iframeSafeUrl(): SafeResourceUrl {
    return this._iframeSafeUrl;
  }

  set iframeSafeUrl(value: SafeResourceUrl) {
    this._iframeSafeUrl = value;
  }

  get iframeWindow(): any {
    return this._iframeWindow;
  }

  set iframeWindow(value: any) {
    this._iframeWindow = value;
  }

  get iframeElement(): any {
    return this._iframeElement;
  }

  set iframeElement(value: any) {
    this._iframeElement = value;
  }

  get iframeUrl(): string {
    return this._iframeUrl;
  }

  set iframeUrl(value: string) {
    this._iframeUrl = value;
  }

  get elasticIndex(): string {
    return this._elasticIndex;
  }

  set elasticIndex(value: string) {
    this._elasticIndex = value;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }

  constructor(private domSanitizer: DomSanitizer) {
    this.iFrameAddListener();
  }

  ngOnInit() {
    this.iframeSafeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.iframeUrl);
  }


  private iFrameAddListener() {
    let that = this;
    let eventMethod = "addEventListener";
    let eventer = window[eventMethod];
    let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from parent (or any other) window
    eventer(messageEvent, this.pluginNotification);

  }


  private addPartialVis(iReplace: boolean) {
    eval(this.CreateDashCode);
  }

  private flush() {
    this.callPlugin({actionType: "flushSearchChip"});

  }

  private toggle() {
    let visPartial = {};

    if (!this.showVis) {
      visPartial["prevoiusVisId"] = "memory";
    }
    else {
      visPartial["visDashboardDefenetion"] = {
        col: 1,
        id: "memory",
        panelIndex: 9,
        row: 1,
        size_x: 3,
        size_y: 3,
        type: "visualization"
      };
    }

    this.showVis = !this.showVis;
    this.callPlugin({actionType: "setVisualization", visDefenetion: [visPartial]});
  }

  private addFullVis(iReplace: boolean) {
    let visDefenetion = {id: "tags"}
    visDefenetion["isFullState"] = true;
    visDefenetion["visState"] = {
      "title": "tags",
      "type": "tagcloud",
      "params": {
        "scale": "linear",
        "orientation": "single",
        "minFontSize": 18,
        "maxFontSize": 72
      },
      "aggs": [
        {
          "id": "1",
          "enabled": true,
          "type": "count",
          "schema": "metric",
          "params": {}
        },
        {
          "id": "2",
          "enabled": true,
          "type": "terms",
          "schema": "segment",
          "params": {
            "field": "@tags.raw",
            "size": 5,
            "order": "desc",
            "orderBy": "1"
          }
        }
      ],
      "listeners": {}
    };
    visDefenetion["visIndex"] = this.elasticIndex;
    if (iReplace) {
      visDefenetion["prevoiusVisId"] = "memory";

    }
    else {
      visDefenetion["visDashboardDefenetion"] = {
        col: 1,
        id: "tags",
        panelIndex: 3,
        row: 1,
        size_x: 3,
        size_y: 3,
        type: "visualization"
      };
    }

    this.callPlugin({actionType: "setVisualization", visDefenetion: [visDefenetion]});

  }

  private deleteVis() {

  }

  private callPlugin(iMessage) {
    this.iframeElement = document.getElementById('multintIframe');
    this.iframeWindow = (<HTMLIFrameElement>this.iframeElement).contentWindow;
    this.iframeWindow.postMessage(iMessage, '*');
  }

  private aa() {


    var visDefenetion2 = {id: "memory"};
    visDefenetion2["isFullState"] = true;
    visDefenetion2["visIndex"] = "logstash-*";

    visDefenetion2["visState"] = {
      "title": "memory",
      "type": "histogram",
      "params": {
        "shareYAxis": true,
        "addTooltip": true,
        "addLegend": true,
        "legendPosition": "right",
        "scale": "linear",
        "mode": "stacked",
        "times": [],
        "addTimeMarker": false,
        "defaultYExtents": false,
        "setYExtents": false,
        "yAxis": {}
      },
      "aggs": [
        {
          "id": "1",
          "enabled": true,
          "type": "count",
          "schema": "metric",
          "params": {}
        },
        {
          "id": "2",
          "enabled": true,
          "type": "terms",
          "schema": "segment",
          "params": {
            "field": "memory",
            "size": 5,
            "order": "desc",
            "orderBy": "1"
          }
        }
      ],
      "listeners": {}
    };
    visDefenetion2["prevoiusVisId"] = "6c750e90-49f7-11e7-9840-33c48f0b32ab";


    var visDelete = {};

    visDelete["isFullState"] = false;
    visDelete["visState"] = null;
    visDelete["prevoiusVisId"] = "amper1";

    // this.iframeWindow.postMessage({actionType: "setVisualization", visDefenetion: [visPartial]}, '*');


  }

  private searchText(iText) {
    this.callPlugin({actionType: "addSearchChip", text: iText, index: this.elasticIndex});
  }

  private createIndexPattern() {
    this.callPlugin({actionType: "createIndexPattern", index: this.elasticIndex, timeField: "@timestamp"});
  }

  private isIndexPatternExist() {
    this.callPlugin({actionType: "isIndexPatternExist", indexPattern: this.elasticIndex});
  }

  private setDefaultIndexPattern() {
    this.callPlugin({actionType: "setDefaultIndexPattern", indexPattern: "logstash-*"});
  }

  private pluginNotification = (e) => {
    let that = this;
    let func = e.data.split('##')[0];
    let res = JSON.parse(e.data.split('##')[1]);
    console.log("func:", func, "res:", res);
    // if (func == "load") {
    //   that.createBaseDashboard()
    // }
  };


}
