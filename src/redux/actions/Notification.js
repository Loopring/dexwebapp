import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faGhost } from '@fortawesome/free-solid-svg-icons/faGhost';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { notification } from 'antd';
import { tracker } from 'components/DefaultTracker';
import React from 'react';

const topPosition = 56;

const closeIcon = (theme) => {
  return <FontAwesomeIcon style={{ color: theme.textDim }} icon={faTimes} />;
};

function trackEvent(message) {
  try {
    tracker.trackEvent({
      type: 'USER_NOTIFICATION',
      data: {
        message: message['props']['s'],
      },
    });
  } catch (error) {}
}

export function notifyInfo(message, theme, duration) {
  trackEvent(message);
  notification.info({
    message: message,
    closeIcon: closeIcon(theme),
    icon: null,
    duration: duration || 3,
    top: topPosition,
    style: {
      background: theme.notificationBackground,
    },
  });
}

export function notifySuccess(message, theme, duration) {
  trackEvent(message);
  notification.success({
    message: message,
    closeIcon: closeIcon(theme),
    icon: <FontAwesomeIcon icon={faCheckCircle} />,
    duration: duration || 3,
    top: topPosition,
    style: {
      color: theme.green,
      background: theme.notificationBackground,
    },
  });
}

export function notifyWarning(message, theme, duration) {
  trackEvent(message);
  notification.warning({
    message: message,
    closeIcon: closeIcon(theme),
    icon: <FontAwesomeIcon icon={faInfoCircle} />,
    duration: duration || 5,
    top: topPosition,
    style: {
      color: theme.orange,
      background: theme.notificationBackground,
    },
  });
}

export function notifyError(message, theme, duration) {
  trackEvent(message);
  try {
    notification.error({
      message: message,
      closeIcon: closeIcon(theme),
      icon: <FontAwesomeIcon icon={faGhost} />,
      duration: duration || 5,
      top: topPosition,
      style: {
        color: theme.red,
        background: theme.notificationBackground,
      },
    });
  } catch {}
}
