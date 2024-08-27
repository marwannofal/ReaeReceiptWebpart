import {
  IReadonlyTheme,
} from '@microsoft/sp-component-base';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IReadReceiptWebpartProps {
  documentTitle: string;
  currentUserDisplayName: string;
  storgeList: string;
  acknowledgementLabel: string;
  acknowledgemenMessage: string;
  readMessage: string; 
  themeVeriant: IReadonlyTheme | undefined;
  configured: boolean;
  context: WebPartContext;
}
