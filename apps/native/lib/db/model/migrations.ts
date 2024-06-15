import { schemaMigrations } from "@nozbe/watermelondb/Schema/migrations";

export default schemaMigrations({
  migrations: [
    // {
    //   toVersion: 3,
    //   steps: [
    //     addColumns({
    //       table: Table.sharedWith.name,
    //       columns: [
    //         {
    //           name: "status",
    //           type: "string"
    //         }
    //       ]
    //     })
    //   ]
    // },
    // {
    //   toVersion: 2,
    //   steps: [
    //     createTable({
    //       name: Table.sharedWith.name,
    //       columns: Table.sharedWith.columns
    //     })
    //   ]
    // }
  ]
});
