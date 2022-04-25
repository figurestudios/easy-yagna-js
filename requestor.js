const { Executor, Task, utils: { asyncWith }, vm } = require("yajsapi");

async function main() {
  const package = await vm.repo({
    image_hash: "5bad68e701cc8a172f741f2dd8775f94916cdf58218a24f013198178"
  });
  const tasks = [new Task({})];

  async function* worker(context, tasks) {
    for await (let task of tasks) {
      // upload the node_modules.zip
      context.send_file("node_modules.zip", "/golem/input/node_modules.zip");
      // extract the node_modules directory from node_modules.zip
      context.run("/bin/sh", ["-c", "extract-zip /golem/input/node_modules.zip /golem/input/node_modules"]);
      // upload the provider.js script
      context.send_file("provider.js", "/golem/input/provider.js");
      // run the provider.js script
      context.run("/bin/sh", ["-c", "node /golem/input/provider.js"]);

      const future_result = yield context.commit();
      const { results } = await future_result;
      task.accept_result(results[results.length - 1])
    }
  }

  await asyncWith(
    new Executor({ task_package: package, budget: "1.0", subnet_tag: "devnet-beta.2" }),
    async (executor) => {
      for await (let completed of executor.submit(worker, tasks)) {
        // console.log the console output of the provider machine
        console.log(completed.result().stdout);
      }
    }
  );
}

main();