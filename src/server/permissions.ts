export type TelegramAction =
  | "read"
  | "write_movimiento"
  | "delete_own_movimiento"
  | "delete_any_movimiento"
  | "delete_empresa"
  | "export_drive"
  | "invite_telegram";

export interface MemberPermissions {
  delete_any?: boolean;
  export_drive?: boolean;
  invite_telegram?: boolean;
}

export interface MemberContext {
  role: "owner" | "editor" | "viewer";
  permissions: MemberPermissions;
  user_id: string;
}

export function can(member: MemberContext, action: TelegramAction): boolean {
  if (member.role === "owner") return true;
  if (member.role === "viewer") return action === "read";

  // editor
  switch (action) {
    case "read":
    case "write_movimiento":
    case "delete_own_movimiento":
      return true;
    case "delete_any_movimiento":
      return !!member.permissions.delete_any;
    case "delete_empresa":
      return false;
    case "export_drive":
      return !!member.permissions.export_drive;
    case "invite_telegram":
      return !!member.permissions.invite_telegram;
    default:
      return false;
  }
}
