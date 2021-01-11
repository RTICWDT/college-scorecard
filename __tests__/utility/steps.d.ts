
type ICodeceptCallback = (i?: CodeceptJS.I, current?:any, ...args: any) => void;

declare class FeatureConfig {
  retry(times: number): FeatureConfig
  timeout(seconds: number): FeatureConfig
  config(config: object): FeatureConfig
  config(helperName: string, config: object): FeatureConfig
  tag(tagName: string): FeatureConfig
}

declare class ScenarioConfig {
  throws(err: any): ScenarioConfig;
  fails(): ScenarioConfig;
  retry(times: number): ScenarioConfig
  timeout(timeout: number): ScenarioConfig
  inject(inject: object): ScenarioConfig
  config(config: object): ScenarioConfig
  config(helperName: string, config: object): ScenarioConfig
  tag(tagName: string): ScenarioConfig
  injectDependencies(dependencies: { [key: string]: any }): ScenarioConfig
}

interface ILocator {
  id?: string;
  xpath?: string;
  css?: string;
  name?: string;
  frame?: string;
  android?: string;
  ios?: string;
}

type LocatorOrString = string | ILocator | Locator;

declare class Container {
  create(config: Object, opts: Object): void
  plugins(name?: string): Object
  support(name?: string): Object
  helpers(name?: string): Object
  translation(): Object
  mocha(): Object
  append(newContainer: Object): void
  clear(newHelpers: Object, newSupport: Object, newPlugins: Object): void
}

declare class RecorderSession {
  running: boolean
    start(name: string): void
    restore(name: string): void
    catch(fn: CallableFunction): void
}

declare class Recorder {
  retries: Object[]
  start(): void
  isRunning(): boolean
  startUnlessRunning(): void
  errHandler(fn: CallableFunction): void
  reset(): void
  session: RecorderSession
  add(taskName: string, fn?: CallableFunction, force?: boolean, retry?: boolean): Promise<any>
  retry(opts: Object): Promise<any>
  catch(customErrFn: CallableFunction): Promise<any>
  catchWithoutStop(customErrFn: CallableFunction ): Promise<any>
  throw(err: Error): Promise<any>
  saveFirstAsyncError(err: Error): void
  getAsyncErr(): Promise<Error>
  cleanAsyncErr(): void
  stop():void
  promise(): Promise<any>
  scheduled(): string[]
  toString(): string
  add(hookName: string, fn: CallableFunction, force?: boolean): void
  catch(customErrFn: CallableFunction): void
}

declare class CodeceptJSEvent {
  dispatcher: NodeJS.EventEmitter
  test: {
    started: string
    before: string
    after: string
    passed: string
    failed: string
    finished: string
  }
  suite: {
    before: string,
    after: string,
  }
  hook: {
    started: string,
    passed: string,
  }
  step: {
    before: string,
    after: string,
    started: string,
    passed: string,
    failed: string,
    finished: string,
  }
  all: {
    before: string,
    after: string,
    result: string,
  }
  multiple: {
    before: string,
    after: string,
  }
  emit(event: string, param: string): void
  cleanDispatcher(): void
}

declare class Output {
  colors: any
  styles: {
    error: any,
    success: any,
    scenario: any,
    basic: any,
    debug: any,
    log: any,
  }

  print(msg: string): void
  stepShift: number
  level(level: number): number
  process(process: string): string
  debug(msg: string): void
  log(msg: string): void
  error(msg: string): void
  success(msg: string): void
  plugin(name: string, msg: string): void
  step(step: any): void
  suite: {
    started: Function
  }
  test: {
    started(test: string): void
    passed(test: string): void
    failed(test: string): void
    skipped(test: string): void
  }
  scenario: {
    started(test: string): void
    passed(test: string): void
    failed(test: string): void
  }
  say(message: string, color?: string): void
  result(passed: number, failed: number, skipped: number, duration: string): void
}

declare class Config {
  create(newConfig: Object): Object
  load(configFile: string): Config
  get(key: string, val: any): any
  append(additionalConfig: Object): Object
  reset(): Object
}

declare class Helper {
  /** Abstract method to provide required config options */
  static _config(): any;
  /** Abstract method to validate config */
  _validateConfig<T>(config: T): T;
  /** Sets config for current test */
  _setConfig(opts: any): void;
  /** Hook executed before all tests */
  _init(): void
  /** Hook executed before each test. */
  _before(): void
  /** Hook executed after each test */
  _after(): void
  /**
   * Hook provides a test details
   * Executed in the very beginning of a test
   */
  _test(test: () => void): void
  /** Hook executed after each passed test */
  _passed(test: () => void): void
  /** Hook executed after each failed test */
  _failed(test: () => void): void
  /** Hook executed before each step */
  _beforeStep(step: () => void): void
  /** Hook executed after each step */
  _afterStep(step: () => void): void
  /** Hook executed before each suite */
  _beforeSuite(suite: () => void): void
  /** Hook executed after each suite */
  _afterSuite(suite: () => void): void
  /** Hook executed after all tests are executed */
  _finishTest(suite: () => void): void
  /**Access another configured helper: this.helpers['AnotherHelper'] */
  readonly helpers: any
  /** Print debug message to console (outputs only in debug mode) */
  debug(msg: string): void

  debugSection(section: string, msg: string): void
}

declare class Locator {
  constructor(locator: LocatorOrString, defaultType?: string);

  or(locator: LocatorOrString): Locator;
  find(locator: LocatorOrString): Locator;
  withChild(locator: LocatorOrString): Locator;
  withDescendant(locator: LocatorOrString): Locator;
  at(position: number): Locator;
  first(): Locator;
  last(): Locator;
  inside(locator: LocatorOrString): Locator;
  before(locator: LocatorOrString): Locator;
  after(locator: LocatorOrString): Locator;
  withText(text: string): Locator;
  withAttr(attrs: object): Locator;
  as(output: string): Locator;
}


declare function actor(customSteps?: {
  [action: string]: (this: CodeceptJS.I, ...args: any[]) => void
}): CodeceptJS.I;
declare function actor(customSteps?: {}): CodeceptJS.I;
declare function Feature(title: string, opts?: {}): FeatureConfig;
declare const Scenario: {
  (title: string, callback: ICodeceptCallback): ScenarioConfig;
  (title: string, opts: {}, callback: ICodeceptCallback): ScenarioConfig;
  only(title: string, callback: ICodeceptCallback): ScenarioConfig;
  only(title: string, opts: {}, callback: ICodeceptCallback): ScenarioConfig;
}
declare interface IScenario {
  Scenario(title: string, callback: ICodeceptCallback): ScenarioConfig;
  Scenario(title: string, opts: {}, callback: ICodeceptCallback): ScenarioConfig;
}
declare function xScenario(title: string, callback: ICodeceptCallback): ScenarioConfig;
declare function xScenario(title: string, opts: {}, callback: ICodeceptCallback): ScenarioConfig;
declare interface IData {
  Scenario(title: string, callback: ICodeceptCallback): ScenarioConfig;
  Scenario(title: string, opts: {}, callback: ICodeceptCallback): ScenarioConfig;
  only: IScenario;
}
declare function Data(data: any): IData;
declare function xData(data: any): IData;
declare function Before(callback: ICodeceptCallback): void;
declare function BeforeSuite(callback: ICodeceptCallback): void;
declare function After(callback: ICodeceptCallback): void;
declare function AfterSuite(callback: ICodeceptCallback): void;

declare function inject(): {
  I: CodeceptJS.I
};
declare function locate(selector: LocatorOrString): Locator;
declare function within(selector: LocatorOrString, callback: Function): Promise<any>;
declare function session(selector: LocatorOrString, callback: Function): Promise<any>;
declare function session(selector: LocatorOrString, config: any, callback: Function): Promise<any>;
declare function pause(): void;
declare function secret(secret: any): string;

declare const codeceptjs: any;

declare namespace CodeceptJS {
  export const container: Container
  export const recorder: Recorder
  export const event: CodeceptJSEvent
  export const output: Output
  export const config: Config

  export interface I {
    amAcceptingPopups() : void,
    acceptPopup() : void,
    amCancellingPopups() : void,
    cancelPopup() : void,
    seeInPopup(text: string) : void,
    grabPopupText() : Promise<string>,
    amOnPage(url: string) : void,
    resizeWindow(width: number, height: number) : void,
    haveRequestHeaders(customHeaders: string) : void,
    moveCursorTo(locator: LocatorOrString, offsetX?: number, offsetY?: number) : void,
    dragAndDrop(srcElement: string, destElement: string) : void,
    refreshPage() : void,
    scrollPageToTop() : void,
    scrollPageToBottom() : void,
    scrollTo(locator: LocatorOrString, offsetX?: number, offsetY?: number) : void,
    seeInTitle(text: string) : void,
    grabPageScrollPosition() : Promise<string>,
    seeTitleEquals(text: string) : void,
    dontSeeInTitle(text: string) : void,
    grabTitle() : Promise<string>,
    switchToNextTab(num?: number) : void,
    switchToPreviousTab(num?: number) : void,
    closeCurrentTab() : void,
    closeOtherTabs() : void,
    openNewTab() : void,
    grabNumberOfOpenTabs() : Promise<string>,
    seeElement(locator: LocatorOrString) : void,
    dontSeeElement(locator: LocatorOrString) : void,
    seeElementInDOM(locator: LocatorOrString) : void,
    dontSeeElementInDOM(locator: LocatorOrString) : void,
    click(locator: LocatorOrString, context?: LocatorOrString) : void,
    clickLink(locator: LocatorOrString, context?: LocatorOrString) : void,
    handleDownloads(downloadPath?: string) : void,
    downloadFile(locator: LocatorOrString, customName: string) : void,
    doubleClick(locator: LocatorOrString, context?: LocatorOrString) : void,
    rightClick(locator: LocatorOrString, context?: LocatorOrString) : void,
    checkOption(field: LocatorOrString, context?: LocatorOrString) : void,
    uncheckOption(field: LocatorOrString, context?: LocatorOrString) : void,
    seeCheckboxIsChecked(field: LocatorOrString) : void,
    dontSeeCheckboxIsChecked(field: LocatorOrString) : void,
    pressKeyDown(key: string) : void,
    pressKeyUp(key: string) : void,
    pressKey(key: string) : void,
    fillField(field: LocatorOrString, value: string) : void,
    clearField(field: LocatorOrString) : void,
    appendField(field: LocatorOrString, value: string) : void,
    seeInField(field: LocatorOrString, value: string) : void,
    dontSeeInField(field: LocatorOrString, value: string) : void,
    attachFile(locator: LocatorOrString, pathToFile: string) : void,
    selectOption(select: LocatorOrString, option: string) : void,
    grabNumberOfVisibleElements(locator: LocatorOrString) : Promise<string>,
    seeInCurrentUrl(url: string) : void,
    dontSeeInCurrentUrl(url: string) : void,
    seeCurrentUrlEquals(url: string) : void,
    dontSeeCurrentUrlEquals(url: string) : void,
    see(text: string, context?: LocatorOrString) : void,
    seeTextEquals(text: string, context?: LocatorOrString) : void,
    dontSee(text: string, context?: LocatorOrString) : void,
    grabSource() : Promise<string>,
    grabBrowserLogs() : Promise<string>,
    grabCurrentUrl() : Promise<string>,
    seeInSource(text: string) : void,
    dontSeeInSource(text: string) : void,
    seeNumberOfElements(locator: LocatorOrString, num: number) : void,
    seeNumberOfVisibleElements(locator: LocatorOrString, num: number) : void,
    setCookie(cookie: string) : void,
    seeCookie(name: string) : void,
    dontSeeCookie(name: string) : void,
    grabCookie(name: string) : Promise<string>,
    clearCookie(name: string) : void,
    executeScript(fn: Function) : void,
    executeAsyncScript(fn: Function) : void,
    grabTextFrom(locator: LocatorOrString) : Promise<string>,
    grabValueFrom(locator: LocatorOrString) : Promise<string>,
    grabHTMLFrom(locator: LocatorOrString) : Promise<string>,
    grabCssPropertyFrom(locator: LocatorOrString, cssProperty: string) : Promise<string>,
    seeCssPropertiesOnElements(locator: LocatorOrString, cssProperties: string) : void,
    seeAttributesOnElements(locator: LocatorOrString, attributes: string) : void,
    dragSlider(locator: LocatorOrString, offsetX?: number) : void,
    grabAttributeFrom(locator: LocatorOrString, attr: string) : Promise<string>,
    saveScreenshot(fileName: string, fullPage: string) : void,
    wait(sec: number) : void,
    waitForEnabled(locator: LocatorOrString, sec: number) : void,
    waitForValue(field: LocatorOrString, value: string, sec: number) : void,
    waitNumberOfVisibleElements(locator: LocatorOrString, num: number, sec: number) : void,
    waitForElement(locator: LocatorOrString, sec: number) : void,
    waitForVisible(locator: LocatorOrString, sec: number) : void,
    waitForInvisible(locator: LocatorOrString, sec: number) : void,
    waitToHide(locator: LocatorOrString, sec: number) : void,
    waitInUrl(urlPart: string, sec?: number) : void,
    waitUrlEquals(urlPart: string, sec?: number) : void,
    waitForText(text: string, sec?: number, context?: LocatorOrString) : void,
    waitForRequest(urlOrPredicate: string, sec?: number) : void,
    waitForResponse(urlOrPredicate: string, sec?: number) : void,
    switchTo(locator: LocatorOrString) : void,
    waitForFunction(fn: Function, argsOrSec?: string, sec?: number) : void,
    waitForNavigation(opts?: string) : void,
    waitUntil(fn: Function, sec?: number) : void,
    waitUntilExists(locator: LocatorOrString, sec: number) : void,
    waitForDetached(locator: LocatorOrString, sec: number) : void,
    grabDataFromPerformanceTiming() : Promise<string>,
    grabElementBoundingRect(locator: LocatorOrString, prop: string) : Promise<string>,
    debug(msg: string) : void,
    debugSection(section: string, msg: string) : void,
    say: () => any; 
    retryStep(opts: string) : void,

  }

}

declare module "codeceptjs" {
  export = CodeceptJS;
}
