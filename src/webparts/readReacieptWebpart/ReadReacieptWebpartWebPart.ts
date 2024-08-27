import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IReadonlyTheme ,  
  ThemeProvider,
  ThemeChangedEventArgs, 
} from '@microsoft/sp-component-base';

import * as strings from 'ReadReacieptWebpartWebPartStrings';
import  ReadReceiptWebpart  from './components/ReadReacieptWebpart';
import { IReadReceiptWebpartProps } from './components/IReadReacieptWebpartProps';



import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";



import { 
  PropertyFieldListPicker, 
  PropertyFieldListPickerOrderBy 
} from '@pnp/spfx-property-controls';



export interface IReadReceiptWebpartWebPartProps {
  documentTitle: string;
  storgeList: string;
  acknowledgementLabel: string;
  acknowledgemenMessage: string;
  readMessage: string; 
}

export default class ReadReceiptWebpartWebPart extends BaseClientSideWebPart<IReadReceiptWebpartWebPartProps> {

  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;

  protected async onInit(): Promise<void> {
    await super.onInit();
    const sp = spfi().using(SPFx(this.context));
    this._themeProvider = this.context.serviceScope.consume(
      ThemeProvider.serviceKey
    );

    this._themeVariant = this._themeProvider.tryGetTheme();

    this._themeProvider.themeChangedEvent.add(
      this,
      this._handleThemeChangedEvent
    );

    const web = await sp.web();
    console.log(`Title: ${web.Title}`);
  }

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }


  public render(): void {
    const element: React.ReactElement<IReadReceiptWebpartProps> = React.createElement(
      ReadReceiptWebpart,
      {
        documentTitle: this.properties.documentTitle,
        currentUserDisplayName: this.context.pageContext.user.displayName,
        storgeList: this.properties.storgeList,
        acknowledgementLabel: this.properties.acknowledgementLabel,
        acknowledgemenMessage: this.properties.acknowledgemenMessage,
        readMessage: this.properties.readMessage,
        themeVeriant: this._themeVariant,
        configured: this.properties.storgeList ? this.properties.storgeList !== '' : false,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldListPicker('storgeList', {
                  label: strings.storgeListLabel,
                  selectedList: this.properties.storgeList,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: undefined,
                  deferredValidationTime: 0,
                  key: 'ListPickerFieldId',
                  multiSelect: false,
                  baseTemplate: 100
                }),
                PropertyPaneTextField('documentTitle',{
                  label: strings.DocumentTtileLabel
                }),
                PropertyPaneTextField('acknowledgementLabel',{
                  label: strings.AcknowledgementLabelLabel
                }),
                PropertyPaneTextField('acknowledgemenMessage',{
                  label: strings.AcknowledgemenMessageLabel
                }),
                PropertyPaneTextField('readMessage',{
                  label: strings.ReadMessageLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
