import React from "react";
import { DialogProps } from "react-native-paper";

const ALERT_LIMIT = 1;
const ALERT_REMOVE_DELAY = 1000000;

type AlertProps = Omit<DialogProps, "children"> & {
  id: string;
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode | AlertAction;
};

type AlertAction = (
  props: Pick<AlertProps, "id"> & {
    dismiss: () => void;
  }
) => React.ReactNode;

const actionTypes = {
  ADD_ALERT: "ADD_ALERT",
  UPDATE_ALERT: "UPDATE_ALERT",
  DISMISS_ALERT: "DISMISS_ALERT",
  REMOVE_ALERT: "REMOVE_ALERT"
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_ALERT"];
      alert: AlertProps;
    }
  | {
      type: ActionType["UPDATE_ALERT"];
      toast: Partial<AlertProps>;
    }
  | {
      type: ActionType["DISMISS_ALERT"];
      alertId?: AlertProps["id"];
    }
  | {
      type: ActionType["REMOVE_ALERT"];
      toastId?: AlertProps["id"];
    };

interface State {
  alerts: AlertProps[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_ALERT",
      toastId: toastId
    });
  }, ALERT_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_ALERT":
      return {
        ...state,
        alerts: [action.alert, ...state.alerts].slice(0, ALERT_LIMIT)
      };

    case "UPDATE_ALERT":
      return {
        ...state,
        alerts: state.alerts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };

    case "DISMISS_ALERT": {
      const { alertId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (alertId) {
        addToRemoveQueue(alertId);
      } else {
        state.alerts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        alerts: state.alerts.map((t) =>
          t.id === alertId || alertId === undefined
            ? {
                ...t,
                visible: false
              }
            : t
        )
      };
    }
    case "REMOVE_ALERT":
      if (action.toastId === undefined) {
        return {
          ...state,
          alerts: []
        };
      }
      return {
        ...state,
        alerts: state.alerts.filter((t) => t.id !== action.toastId)
      };
  }
};

const listeners: ((state: State) => void)[] = [];

let memoryState: State = { alerts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Alert = Omit<AlertProps, "id">;

function alert({ ...props }: Omit<Alert, "visible">) {
  const id = genId();

  const update = (props: AlertProps) =>
    dispatch({
      type: "UPDATE_ALERT",
      toast: { ...props, id }
    });

  const dismiss = () => dispatch({ type: "DISMISS_ALERT", alertId: id });

  dispatch({
    type: "ADD_ALERT",
    alert: {
      ...props,
      id,
      visible: true,
      onDismiss: dismiss
    }
  });

  return {
    id: id,
    dismiss,
    update
  };
}

function useAlert() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    alert,
    dismiss: (alertId?: string) =>
      dispatch({ type: "DISMISS_ALERT", alertId: alertId })
  };
}

export { alert, useAlert };
