import gql from 'graphql-tag';

export const USER_FRAGMENT = gql`
  fragment User on User {
    id
    name
    email
    avatar
    enabled
  }
`;

export const PROXY_FRAGMENT = gql`
  fragment Proxy on Proxy {
    id
    host
    port
    username
    password
  }
`;
export const ACTIVITY_FRAGMENT = gql`
  fragment Activity on Activity {
    id
    ip
    browser
    content
    createdAt
  }
`;

export const CREDIT_FRAGMENT = gql`
  fragment Credit on Credit {
    id
    remaining
    spent
    lifeTimeSpent
  }
`;

export const PACKAGE_FRAGMENT = gql`
  fragment Package on Package {
    id
    name
    role
    level
    allocatedCredits
    price
    autoRenew {
      onExhaust
      monthly
    }
  }
`;

export const ORDER_FRAGMENT = gql`
  fragment Order on Order {
    id
    package {
      ...Package
    }
    createdAt
  }
  ${PACKAGE_FRAGMENT}
`;

export const SETTINGS_FRAGMENT = gql`
  fragment Settings on Settings {
    id
    options {
      id
      schedules
      downloads
      imports
      exports
    }
    instance {
      id
      proxies {
        id
        host
        username
        password
      }
      navigation {
        id
        retry {
          id
          delay
          count
        }
        timeout
      }
      limits {
        id
        concurrentInstances
        instancesPerUser
        rowsPerPage
        rowsPerInstance
      }
      intervals {
        id
        poll
        tinyAction
      }
    }
  }
`;

export const LOGS_FRAGMENT = gql`
  fragment Log on Log {
    id
    lastAction
    time
    message
  }
`;

export const INSTANCE_FRAGMENT = gql`
  fragment Instance on Instance {
    id
    user {
      credit {
        ...Credit
      }
    }
    actionList
    title
    creditSpent
    meta {
      scrappingType
      urlRaw
      enabled
      userAgent
      viewportWidth
      viewportHeight
      __typename
    }
    logs {
      id
      lastAction
      time
      message
      __typename
    }
    output
    isRequested
    isQueued
    isRunning
    isCanceled
    isForcedStopped
    isFinished
    status
    queuedAt
    startedAt
    finishedAt
    createdAt
    updatedAt
    __typename
  }
  ${CREDIT_FRAGMENT}
`;
