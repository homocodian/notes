import * as React from "react";
import { Dialog, Portal, Text } from "react-native-paper";
import { useAlert } from "./use-alert";

export function Alerter() {
	const { alerts, dismiss } = useAlert();

	return alerts.map(({ id, title, description, action, ...props }) => (
		<Portal key={id}>
			<Dialog {...props}>
				{title ? <Dialog.Title>{title}</Dialog.Title> : null}
				<Dialog.Content>
					{typeof description === "string" ? (
						<Text variant="bodyMedium">{description}</Text>
					) : (
						description
					)}
				</Dialog.Content>
				{action && (
					<Dialog.Actions>
						{typeof action === "function"
							? action({ id, dismiss: () => dismiss(id) })
							: action}
					</Dialog.Actions>
				)}
			</Dialog>
		</Portal>
	));
}
