import { FormattedMessage, formatMessage } from 'umi';
import React, { Component } from 'react';

import { List } from 'antd';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = {
  strong: (
    <span className="strong">
      <FormattedMessage id="accountandaccountsettings.security.strong" defaultMessage="Strong" />
    </span>
  ),
  medium: (
    <span className="medium">
      <FormattedMessage id="accountandaccountsettings.security.medium" defaultMessage="Medium" />
    </span>
  ),
  weak: (
    <span className="weak">
      <FormattedMessage id="accountandaccountsettings.security.weak" defaultMessage="Weak" />
      Weak
    </span>
  ),
};

class SecurityView extends Component {
  getData = () => [
    {
      title: formatMessage({ id: 'accountandaccountsettings.security.password' }, {}),
      description: (
        <>
          {formatMessage({ id: 'accountandaccountsettings.security.password-description' })}：
          {passwordStrength.strong}
        </>
      ),
      actions: [
        <a key="Modify">
          <FormattedMessage id="accountandaccountsettings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'accountandaccountsettings.security.phone' }, {}),
      description: `${formatMessage(
        { id: 'accountandaccountsettings.security.phone-description' },
        {},
      )}：138****8293`,
      actions: [
        <a key="Modify">
          <FormattedMessage id="accountandaccountsettings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'accountandaccountsettings.security.question' }, {}),
      description: formatMessage({ id: 'accountandaccountsettings.security.question-description' }, {}),
      actions: [
        <a key="Set">
          <FormattedMessage id="accountandaccountsettings.security.set" defaultMessage="Set" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'accountandaccountsettings.security.email' }, {}),
      description: `${formatMessage(
        { id: 'accountandaccountsettings.security.email-description' },
        {},
      )}：ant***sign.com`,
      actions: [
        <a key="Modify">
          <FormattedMessage id="accountandaccountsettings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'accountandaccountsettings.security.mfa' }, {}),
      description: formatMessage({ id: 'accountandaccountsettings.security.mfa-description' }, {}),
      actions: [
        <a key="bind">
          <FormattedMessage id="accountandaccountsettings.security.bind" defaultMessage="Bind" />
        </a>,
      ],
    },
  ];

  render() {
    const data = this.getData();
    return (
      <>
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default SecurityView;
