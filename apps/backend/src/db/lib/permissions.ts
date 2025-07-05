/*
total access: "*.*.*"
access to area: "human-resources.*.*"
access to module: "human-resources.employees.*"
access to action: "human-resources.employees.create"

access to it's own action: "human-resources.employees:(user_id=own.id).[update|delete]"
*/
export const permissions = [
  {
    name: "admin",
    path: "*", // area.module.action
    description: "Administrator privileges",
    actions: ["*"],
  },
  {
    description:
      "Read and update access to all employees only for their own data",
    path: "hhrr.employees",
    actions: ["read", "update"],
    conditions: ["user_id=own.id"],
  },
];
