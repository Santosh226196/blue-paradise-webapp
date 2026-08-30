import { type ComponentProps } from "react";
import { Button } from "./Button";

type GhostButtonProps = ComponentProps<typeof Button>;

export function GhostButton(props: GhostButtonProps) {
  return <Button variant="ghost" {...props} />;
}
