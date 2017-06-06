import {Component, OnInit} from '@angular/core';
import {SafeResourceUrl, DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  title = 'kibana API demo';
  url = "https://localhost:5601/rey/app/kibana#/dashboard?embed=true&_g=()&_a=(filters:!(),options:(darkTheme:!f),panels:!(),query:(query_string:(analyze_wildcard:!t,query:'*')),timeRestore:!f,title:plugin,uiState:(),viewMode:view)";
  private _iframeUrl: string = this.url;

  private _iframeSafeUrl: SafeResourceUrl;
  private _iframeElement: any;
  private _iframeWindow: any;
  private _elasticIndex: string = "logstash-*";


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

  constructor(private domSanitizer: DomSanitizer,) {
  }

  ngOnInit() {
    this.iframeSafeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.iframeUrl);
  }

  private createBaseDashboard() {
    let visDefenetion1 = {};
    let visDefenetion2 = {};

    visDefenetion1["isFullState"] = true;
    visDefenetion1["visState"] = {
      "title": "referer",
      "type": "pie",
      "params": {
        "shareYAxis": true,
        "addTooltip": true,
        "addLegend": true,
        "legendPosition": "right",
        "isDonut": false
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
            "field": "clientip",
            "size": 5,
            "order": "desc",
            "orderBy": "1"
          }
        }
      ],
      "listeners": {}
    };
    visDefenetion1["visIndex"] = this.elasticIndex;
    visDefenetion1["visDashboardDefenetion"] = {
      col: 1,
      id: "referer",
      panelIndex: 1,
      row: 1,
      size_x: 5,
      size_y: 5,
      type: "visualization"
    };

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
    visDefenetion2["visDashboardDefenetion"] = {
      col: 7,
      id: "memory",
      panelIndex: 2,
      row: 1,
      size_x: 5,
      size_y: 5,
      type: "visualization"
    };
    this.callPlugin([visDefenetion1, visDefenetion2]);


  }

  private addPartialVis(iReplace: boolean) {
    let visPartial = {id: "bytes"};

    visPartial["isFullState"] = false;
    visPartial["visIndex"] = this.elasticIndex;

    visPartial["visState"] = {visType: 'pie', field: 'bytes'};
    if (iReplace) {
      visPartial["prevoiusVisId"] = "memory";

    }
    else{
      visPartial["visDashboardDefenetion"] = {
        col: 1,
        id: "bytes",
        panelIndex: 9,
        row: 1,
        size_x: 3,
        size_y: 3,
        type: "visualization"
      };
    }


    this.callPlugin([visPartial]);

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

    this.callPlugin([visDefenetion]);

  }

  private deleteVis() {

  }

  private callPlugin(iVisArr) {
    this.iframeElement = document.getElementById('multintIframe');
    this.iframeWindow = (<HTMLIFrameElement>this.iframeElement).contentWindow;
    this.iframeWindow.postMessage({actionType: "setVisualization", visDefenetion: iVisArr}, '*');
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


}
