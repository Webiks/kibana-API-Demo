import {Component, OnInit} from '@angular/core';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  title = 'kibana API demo';

  kibanaVersion = '5.5.3';


  //url for not dev
  //url = "http://localhost:5601/app/kibana#/dashboard?embed=true&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(filters:!(),options:(darkTheme:!f),panels:!(),query:(query_string:(analyze_wildcard:!t,query:'*')),timeRestore:!f,title:plugin,uiState:(),viewMode:view)";


  url = this.getUrl();
  private _iframeUrl: string = this.url;

  private _iframeSafeUrl: SafeResourceUrl;
  private _iframeElement: any;
  private _iframeWindow: any;
  private _elasticIndex: string = 'logstash-*';
  private _text: string = '';
  private showVis: boolean = false;

  getUrl() {
    switch (this.kibanaVersion) {
      case '6.0.0':
      case '6.0.1':

        return 'http://localhost:5601/rey/app/kibana#/dashboard?embed=true&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(filters:!(),options:(darkTheme:!f),panels:!(),query:(query_string:(analyze_wildcard:!t,query:\'*\')),timeRestore:!f,title:plugin,uiState:(),viewMode:view)';

      case '6.1.0':
      case '6.1.1':
      case '6.1.2':
      case '6.1.3':
        return 'http://localhost:5601/izt/app/kibana#/dashboard?embed=true&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(description:\'\',filters:!(),fullScreenMode:!f,options:(darkTheme:!f,hidePanelTitles:!f,useMargins:!t),panels:!(),query:(language:lucene,query:\'\'),timeRestore:!f,title:\'New+Dashboard\',uiState:(),viewMode:view)';
      case '5.5.3':

        return 'https://localhost:5601/ayl/app/kibana#/dashboard?embed=true&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(description:\'\',filters:!(),options:(darkTheme:!f),panels:!(),query:(match_all:()),timeRestore:!f,title:\'New%20Dashboard\',uiState:(),viewMode:edit)';
      case '5.3.0':
        return 'https://localhost:5601/rey/app/kibana#/dashboard/create?embed=true&_g=(time:(from:now-5y,mode:quick,to:now))&_a=(filters:!(),options:(darkTheme:!f),panels:!(),query:(query_string:(analyze_wildcard:!t,query:\'*\')),timeRestore:!f,title:plugin,uiState:(),viewMode:view)';

    }
  }

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
    let eventMethod = 'addEventListener';
    let eventer = window[eventMethod];
    let messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';

    // Listen to message from parent (or any other) window
    eventer(messageEvent, this.pluginNotification);

  }

  private createBaseDashboard() {
    let visDefenetion1 = {};
    let visDefenetion2 = {};
    visDefenetion1['id'] = 'clientip';
    visDefenetion1['isFullState'] = true;
    visDefenetion1['visState'] = {
      'title': 'clientip',
      'type': 'pie',
      'params': {
        'shareYAxis': true,
        'addTooltip': true,
        'addLegend': true,
        'legendPosition': 'right',
        'isDonut': false
      },
      'aggs': [
        {
          'id': '1',
          'enabled': true,
          'type': 'count',
          'schema': 'metric',
          'params': {}
        },
        {
          'id': '2',
          'enabled': true,
          'type': 'terms',
          'schema': 'segment',
          'params': {
            'field': 'clientip',
            'size': 5,
            'order': 'desc',
            'orderBy': '1'
          }
        }
      ],
      'listeners': {}
    };
    visDefenetion1['visIndex'] = this.elasticIndex;
    if (Number(this.kibanaVersion.split('-')[0].split('.')[0]) < 6 || this.kibanaVersion == '6.0.0' || this.kibanaVersion == '6.0.1') {
      visDefenetion1['visDashboardDefenetion'] = {
        col: 1,
        id: 'clientip',
        panelIndex: 1,
        row: 1,
        size_x: 5,
        size_y: 5,
        type: 'visualization'
      };
    }
    else {
      visDefenetion1['visDashboardDefenetion'] = {
        gridData: {h: 3, i: '1', w: 6, x: 0, y: 0},
        id: 'clientip',
        panelIndex: '1',
        type: 'visualization',
        version: '6.1.0'
      };
    }


    visDefenetion2['id'] = 'memory';
    visDefenetion2['isFullState'] = true;
    visDefenetion2['visState'] = {
      'title': 'memory',
      'type': 'histogram',
      'params': {
        'shareYAxis': true,
        'addTooltip': true,
        'addLegend': true,
        'legendPosition': 'right',
        'scale': 'linear',
        'mode': 'stacked',
        'times': [],
        'addTimeMarker': false,
        'defaultYExtents': false,
        'setYExtents': false,
        'yAxis': {}
      },
      'aggs': [
        {
          'id': '1',
          'enabled': true,
          'type': 'count',
          'schema': 'metric',
          'params': {}
        },
        {
          'id': '2',
          'enabled': true,
          'type': 'terms',
          'schema': 'segment',
          'params': {
            'field': 'memory',
            'size': 5,
            'order': 'desc',
            'orderBy': '1'
          }
        }
      ],
      'listeners': {}
    };
    visDefenetion2['visIndex'] = this.elasticIndex;
    //visDefenetion2['query'] = 'error'
    visDefenetion2['query'] = {
      'range': {
        'memory': {
          'gte': 1

        }
      }
    }
    if (Number(this.kibanaVersion.split('-')[0].split('.')[0]) < 6 || this.kibanaVersion == '6.0.0' || this.kibanaVersion == '6.0.1') {

      visDefenetion2['visDashboardDefenetion'] = {
        col: 7,
        id: 'memory',
        panelIndex: 2,
        row: 1,
        size_x: 5,
        size_y: 5,
        type: 'visualization'
      };
    }
    else {
      visDefenetion2['visDashboardDefenetion'] = {
        gridData: {h: 3, i: '2', w: 6, x: 6, y: 0},
        id: 'memory',
        panelIndex: '2',
        type: 'visualization',
        version: '6.1.0'

      }
    }
    ;
    this.callPlugin({actionType: 'setVisualization', visDefenetion: [visDefenetion1, visDefenetion2]});


  }

  private addPartialVis(iReplace: boolean) {
    //Define visualization object

    //Set visualiztion ID
    let visPartial = {id: 'bytes'};

    //Set isFullState to false meaning: the programmer pass minimal defenetion attributes
    visPartial['isFullState'] = false;

    //Set the elasticsearch index where the data store
    visPartial['visIndex'] = this.elasticIndex;

    //Set minimal attributes of the visualization, in this example, create pie visualization on the field bytes
    visPartial['visState'] = {visType: 'pie', field: 'bytes', 'title': 'accc'};

    if (iReplace) {
      visPartial['prevoiusVisId'] = 'memory';

    }
    else {
      visPartial['visDashboardDefenetion'] = {
        col: 1,
        id: 'bytes',
        panelIndex: 9,
        row: 1,
        size_x: 3,
        size_y: 3,
        type: 'visualization'
      };
    }


    this.callPlugin({actionType: 'setVisualization', visDefenetion: [visPartial]});

  }

  private flush() {
    this.callPlugin({actionType: 'flushSearchChip'});

  }

  private setTime() {
    this.callPlugin({
      actionType: 'setDashboardTime',
      time: {from: '2020-01-17T11:50:22.377', to: '2020-10-17T12:05:22.377', mode: 'absolute'}
    });

    // this.callPlugin({
    //   actionType: "setDashboardTime",
    //   time: {from: 'now-24h', to: 'now', mode: "quick"}
    // });

    // this.callPlugin({
    //   actionType: "setDashboardTime",
    //   time: {from: 'now-12h', to: 'now', mode: "relative"}
    // });
  }

  private toggle() {
    let visPartial = {'visIndex': this.elasticIndex};

    if (!this.showVis) {
      visPartial['prevoiusVisId'] = 'memory';
    }
    else {
      visPartial['visDashboardDefenetion'] = {
        col: 1,
        id: 'memory',
        panelIndex: 9,
        row: 1,
        size_x: 3,
        size_y: 3,
        type: 'visualization'
      };
    }

    this.showVis = !this.showVis;
    this.callPlugin({actionType: 'setVisualization', visDefenetion: [visPartial]});
  }

  private addFullVis(iReplace: boolean) {
    let visDefenetion = {id: 'tags'}
    visDefenetion['isFullState'] = true;
    visDefenetion['visState'] = {
      'title': 'tags',
      'type': 'tagcloud',
      'params': {
        'scale': 'linear',
        'orientation': 'single',
        'minFontSize': 18,
        'maxFontSize': 72
      },
      'aggs': [
        {
          'id': '1',
          'enabled': true,
          'type': 'count',
          'schema': 'metric',
          'params': {}
        },
        {
          'id': '2',
          'enabled': true,
          'type': 'terms',
          'schema': 'segment',
          'params': {
            'field': '@tags.raw',
            'size': 5,
            'order': 'desc',
            'orderBy': '1'
          }
        }
      ],
      'listeners': {}
    };
    visDefenetion['visIndex'] = this.elasticIndex;
    if (iReplace) {
      visDefenetion['prevoiusVisId'] = 'memory';

    }
    else {
      visDefenetion['visDashboardDefenetion'] = {
        col: 1,
        id: 'tags',
        panelIndex: 3,
        row: 1,
        size_x: 3,
        size_y: 3,
        type: 'visualization'
      };
    }

    this.callPlugin({actionType: 'setVisualization', visDefenetion: [visDefenetion]});

  }

  private deleteVis() {

  }

  private callPlugin(iMessage) {
    this.iframeElement = document.getElementById('multintIframe');
    this.iframeWindow = (<HTMLIFrameElement>this.iframeElement).contentWindow;
    this.iframeWindow.postMessage(iMessage, '*');
  }

  private aa() {


    var visDefenetion2 = {id: 'memory'};
    visDefenetion2['isFullState'] = true;
    visDefenetion2['visIndex'] = 'logstash-*';

    visDefenetion2['visState'] = {
      'title': 'memory',
      'type': 'histogram',
      'params': {
        'shareYAxis': true,
        'addTooltip': true,
        'addLegend': true,
        'legendPosition': 'right',
        'scale': 'linear',
        'mode': 'stacked',
        'times': [],
        'addTimeMarker': false,
        'defaultYExtents': false,
        'setYExtents': false,
        'yAxis': {}
      },
      'aggs': [
        {
          'id': '1',
          'enabled': true,
          'type': 'count',
          'schema': 'metric',
          'params': {}
        },
        {
          'id': '2',
          'enabled': true,
          'type': 'terms',
          'schema': 'segment',
          'params': {
            'field': 'memory',
            'size': 5,
            'order': 'desc',
            'orderBy': '1'
          }
        }
      ],
      'listeners': {}
    };
    visDefenetion2['prevoiusVisId'] = '6c750e90-49f7-11e7-9840-33c48f0b32ab';


    var visDelete = {};

    visDelete['isFullState'] = false;
    visDelete['visState'] = null;
    visDelete['prevoiusVisId'] = 'amper1';

    // this.iframeWindow.postMessage({actionType: "setVisualization", visDefenetion: [visPartial]}, '*');


  }

  private searchText(iText) {
    this.callPlugin({actionType: 'addSearchChip', text: iText, index: this.elasticIndex});
  }

  private createIndexPattern() {
    this.callPlugin({actionType: 'createIndexPattern', index: this.elasticIndex, timeField: '@timestamp'});
  }

  private isIndexPatternExist() {
    this.callPlugin({actionType: 'isIndexPatternExist', indexPattern: this.elasticIndex});
  }

  private setDefaultIndexPattern() {
    this.callPlugin({actionType: 'setDefaultIndexPattern', indexPattern: 'logstash-*'});
  }

  private pluginNotification = (e) => {
    let that = this;
    if (e.data && !e.data.type) {
      let func = e.data.split('##')[0];
      let res = JSON.parse(e.data.split('##')[1]);
      console.log('func:', func, 'res:', res);
    }
    // if (func == "load") {
    //   that.createBaseDashboard()
    // }
  };


}
