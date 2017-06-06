import { CallPluginPage } from './app.po';

describe('call-plugin App', function() {
  let page: CallPluginPage;

  beforeEach(() => {
    page = new CallPluginPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
