import * as React from 'react';
import type { IReadReceiptWebpartProps } from './IReadReacieptWebpartProps';
import { FunctionComponent, useEffect, useState } from 'react';
import { sp } from "@pnp/sp-commonjs/presets/all";
import "@pnp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import {
  Checkbox,
  Text,
  IStackTokens,
  ITheme,
  Stack,
} from "office-ui-fabric-react";
import { ISemanticColors } from '@microsoft/sp-component-base';
import { Placeholder } from '@pnp/spfx-controls-react';


const ReadReceiptWebpart: FunctionComponent<IReadReceiptWebpartProps> = (
  props
) => {
  const [showMessage, setShowMessage] = useState<boolean>(true);
  const semanticColors: Partial<ISemanticColors> = props.themeVeriant?.semanticColors ?? {};
  
  const fetchData = async (): Promise<void> => {
    const items = await sp.web.lists
        .getById(props.storgeList)
        .items.select("Author/ID", "Author/Title", "Author/Name", "Title")
        .expand("Author")
        .top(1)
        .filter(
            `Author/Title eq '${props.currentUserDisplayName}' and Title eq '${props.documentTitle}'`
        )
        .get();

    if (items.length === 0) {
        setShowMessage(true);
    }
  };
  
  useEffect(() => {
    if (props.storgeList && props.storgeList !== "") {
      fetchData().catch(console.error);
    }
  }, [props]);

  const _onConfigure = (): void  => {
    // Context of the web part
    props.context.propertyPane.open();
  }

  function _onChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean): void  {
    sp.web.lists.getById(props.storgeList).items.add({
      Title: props.documentTitle,
    }).catch(console.error);

    setShowMessage(false);
  }

  const mainStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 10,
  };

  return props.configured ? (
    <Stack style={{ backgroundColor: semanticColors.bodyBackground }}>
      {showMessage ? (
        <Stack
          style={{ color: semanticColors.bodyText }}
          tokens={mainStackTokens}>
          <Text>{props.acknowledgemenMessage}</Text>
          <Text variant="large">&apos;{props.documentTitle}&apos;</Text>
          <Checkbox
            theme={props.themeVeriant as ITheme}
            label={props.acknowledgementLabel}
            onChange={_onChange}
          />
        </Stack>
      ) : (
        <Stack style={{ color: semanticColors.bodyText }}>
          <Text variant="large">&apos;{props.documentTitle}&apos;</Text>
          <Text>{props.readMessage}</Text>
        </Stack>
      )
      }
    </Stack>
  ) : (
      <Placeholder 
        iconName="Edit"
        iconText="Configure Read Receipt"
        description="Please configure the web part by choosing a list."
        buttonLabel="Configure"
        onConfigure={_onConfigure}
      />
    );
};

export default ReadReceiptWebpart;