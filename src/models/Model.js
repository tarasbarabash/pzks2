import Graph from "./Graph";
import ExecutionError from "./Error";
import randomMC from "random-material-color";

const READY_STATUS = 1;
const RUNNING_STATUS = 2;
const FINISHED_STATUS = 3;
const TRANSMISSION_STATUS = 4;

const TRANSMISSON_SENDING = 101;
const TRANSMISSION_RECEIVING = 102;

const OPTION_FULL_DUPLEX = 1;

class Model {
  constructor(tasks, cs, queue, algo, connectionType) {
    this.tasksData = tasks;
    this.csData = cs;
    this.queue = queue;
    this.algo = algo;
    this.connectionType = parseInt(connectionType);
    this.tasks = this._formDependecies();
    this.processors = this._prepareProcessors();
    this.result = {};
    this.assignmentLog = {};
    this.tasksOnProcessors = {};
    this.colors = this._getColorArray();
    this.transmissionInfo = {};
    this.transmissions = {};
    Object.keys(this.processors).forEach(processorId => {
      this.tasksOnProcessors[processorId] = [];
      this.transmissionInfo[processorId] = [];
    });
  }

  _getColorArray = () => {
    const colors = {};
    const { nodes } = this.tasksData;
    nodes.forEach(node => {
      const usedColors = Object.keys(colors).map(id => colors[id]);
      const selectedColor = randomMC.getColor({ ignoreColors: usedColors });
      colors[node.id] = selectedColor;
    });
    return colors;
  };

  getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  _formDependecies = () => {
    const { nodes } = this.tasksData;
    const { edges } = this.tasksData;
    const dependencies = {};
    nodes.forEach(node => {
      dependencies[node.id] = { parents: {}, weight: node.weight };
    });
    edges.forEach(edge => {
      dependencies[edge.to].parents = {
        ...dependencies[edge.to].parents,
        [edge.from]: edge.weight
      };
    });
    Object.keys(dependencies).forEach(id => {
      if (Object.keys(dependencies[id].parents).length === 0)
        dependencies[id].status = READY_STATUS;
    });
    return dependencies;
  };

  _toEdgesArray() {
    const { edges } = this.csData;
    const matrix = {};
    edges.forEach(edge => {
      matrix[`${edge.from}`] = {
        ...matrix[edge.from],
        [edge.to]: 1
      };
      matrix[`${edge.to}`] = {
        ...matrix[edge.to],
        [edge.from]: 1
      };
    });
    return matrix;
  }

  _getShortestPath(from, to) {
    if (from === to) return [from];
    const graph = new Graph(this._toEdgesArray());
    const path = graph
      .shortestPath(`${from}`, `${to}`)
      .concat(from)
      .reverse();
    if (path.length === 0) return -1;
    return path;
  }

  _prepareProcessors = () => {
    const { nodes: processors } = this.csData;
    const preparedProcessors = {};
    processors.forEach(processor => {
      preparedProcessors[processor.id] = {
        ...preparedProcessors[processor.id],
        status: READY_STATUS,
        standBy: 0
      };
    });
    return preparedProcessors;
  };

  _getTransmissionTact = (
    sourceId,
    targetId,
    taskEnded,
    transmissionTacts,
    parentTaskId,
    taskId,
    transmissionInfo,
    transmissions
  ) => {
    if (!transmissionInfo) transmissionInfo = this.transmissionInfo;
    if (!transmissions) transmissions = this.transmissions;
    console.log(`Transmissions: ${JSON.stringify(transmissionInfo)}`);
    console.log(`Transmissions: ${JSON.stringify(transmissions)}`);
    const parentTransmission = transmissions[`${parentTaskId} -> ${taskId}`];
    console.log(`Parent Transmission: ${JSON.stringify(parentTransmission)}`);
    const lastEnded = Math.max(
      ...transmissionInfo[sourceId]
        .filter(i =>
          this.connectionType === OPTION_FULL_DUPLEX
            ? i.status === TRANSMISSON_SENDING
            : i
        )
        .map(i => i.end),
      ...transmissionInfo[targetId]
        .filter(i =>
          this.connectionType === OPTION_FULL_DUPLEX
            ? i.status === TRANSMISSION_RECEIVING
            : i
        )
        .map(i => i.end)
    );
    const freeIntervals = this.transferGaps(
      sourceId,
      targetId,
      parentTaskId,
      transmissionInfo
    ).filter(i => i.interval >= transmissionTacts && i.start >= taskEnded);
    console.log(`Free intervals: ${JSON.stringify(freeIntervals)}`);
    console.log(`Last ended: ${JSON.stringify(lastEnded)}`);
    if (freeIntervals.length > 0) {
      for (let freeInterval of freeIntervals) {
        if (!parentTransmission) return freeInterval.start;
        else if (parentTransmission.end <= freeInterval.start)
          return freeInterval.start;
        // else if (parentTransmission.end >= lastEnded)
        // return parentTransmission.end;
        // else return lastEnded;
      }
      // return lastEnded;
    }
    if (!parentTransmission)
      return lastEnded >= taskEnded ? lastEnded : taskEnded;
    return parentTransmission.end > lastEnded
      ? parentTransmission.end
      : lastEnded;
  };

  transferGaps = (source, target, parent, transmissionInfo) => {
    transmissionInfo = JSON.parse(
      JSON.stringify(
        transmissionInfo ? transmissionInfo : this.transmissionInfo
      )
    );
    const busy = [
      ...transmissionInfo[source].filter(i =>
        this.connectionType === OPTION_FULL_DUPLEX
          ? i.status === TRANSMISSON_SENDING
          : i
      ),
      ...transmissionInfo[target].filter(i =>
        this.connectionType === OPTION_FULL_DUPLEX
          ? i.status === TRANSMISSION_RECEIVING
          : i
      ),
      {
        start: this.assignmentLog[parent].started,
        end: this.assignmentLog[parent].ended
      }
    ];
    const sorted = busy.slice().sort((a, b) => (a.start > b.start ? 1 : -1));
    const merged = sorted.slice(0, 1);
    for (let i = 1; i < sorted.length; i++) {
      const cur = sorted[i];
      const last = merged[merged.length - 1];
      if (cur.start <= last.end) last.end = Math.max(last.end, cur.end);
      else merged.push(cur);
    }
    return this.findGaps(merged.filter(i => i !== undefined));
  };

  findGaps = array => {
    return array
      .sort((a, b) => (a.start > b.start ? 1 : -1))
      .map((cur, index, arr) => {
        if (index === arr.length - 1) {
          // console.log(`Index: ${index}`);
          // const { start, end } = array[index];
          // console.log(`Index: ${start}`);
          // const min = Math.min(
          //   ...this.transmissionInfo[target]
          //     .filter(i => i.start >= end)
          //     .map(i => i.start),
          //   ...this.transmissionInfo[source]
          //     .filter(i => i.start >= end)
          //     .map(i => i.start)
          // );
          // console.log(`Min: ${min}`);
          // return { interval: min - end, start: end, end: min };
          // eslint-disable-next-line
          return;
        }
        return {
          interval: arr[index + 1].start - cur.end,
          start: cur.end,
          end: arr[index + 1].start
        };
      })
      .filter(i => i !== undefined);
  };

  _makeTransmissions = (
    taskId,
    processorId,
    tact,
    transmissionInfo,
    transmissions,
    debug = false
  ) => {
    if (!transmissions) transmissions = this.transmissions;
    if (!transmissionInfo) transmissionInfo = this.transmissionInfo;
    const parents = this.tasks[taskId].parents;
    if (Object.keys(parents).length === 0) return tact;
    const tacts = Object.keys(parents).map(parent => {
      const {
        ended: parentEnded,
        processorId: parentProcessor
      } = this.assignmentLog[parent];
      if (parentProcessor === processorId) return tact;
      const path = this._getShortestPath(
        parseInt(parentProcessor),
        parseInt(processorId)
      );
      console.log(
        `Path to transmit ${parent} to ${taskId} from processor ${parentProcessor} to ${processorId} processor: ${JSON.stringify(
          path
        )}`
      );
      if (path === -1) return tact;
      const tacts = [];
      path.forEach((node, index) => {
        if (index === path.length - 1) return;
        const sourceId = node;
        const targetId = path[index + 1];
        const transmissionTacts = this.tasks[taskId].parents[parent];
        tact = this._getTransmissionTact(
          sourceId,
          targetId,
          parentEnded,
          transmissionTacts,
          parent,
          taskId,
          transmissionInfo,
          transmissions
        );
        const transmissionStart = parseInt(tact);
        const transmissionEnd = parseInt(tact) + parseInt(transmissionTacts);
        console.warn(
          `Transmission from ${sourceId} to ${targetId} of task ${parent} starts on ${transmissionStart}, ends on ${transmissionEnd}`
        );
        transmissions[`${parent} -> ${taskId}`] = {
          start: transmissionStart,
          end: transmissionEnd
        };
        transmissionInfo[sourceId].push({
          start: transmissionStart,
          end: transmissionEnd,
          task: parent,
          status: TRANSMISSON_SENDING
        });
        transmissionInfo[targetId].push({
          start: transmissionStart,
          end: transmissionEnd,
          task: parent,
          status: TRANSMISSION_RECEIVING
        });
        if (!debug)
          this.result = {
            ...this.result,
            [`${parent}->${taskId}(${targetId})`]: {
              values: [
                {
                  x: transmissionStart,
                  y: parseFloat(sourceId) + 0.25
                },
                {
                  x: transmissionEnd,
                  y: parseFloat(sourceId) + 0.25
                }
              ],
              color: this.colors[parent]
            }
          };
        tacts.push(transmissionEnd);
      });
      return Math.max(...tacts);
    });
    return Math.max(...tacts, 0);
  };

  _executeTask = (taskId, processorId, tact) => {
    const curTact = tact;
    tact = this._makeTransmissions(taskId, processorId, tact);
    if (curTact > tact) tact = curTact;
    console.warn(
      `Executting task ${taskId} on processor ${processorId} with a starting tact of ${tact}`
    );
    this.assignmentLog[taskId] = {
      processorId,
      started: tact,
      ended: tact + this.tasks[taskId].weight
    };
    this.processors[processorId].status =
      this.processors[processorId].status === TRANSMISSION_STATUS
        ? TRANSMISSION_STATUS
        : RUNNING_STATUS;
    this.processors[processorId].from = tact;
    this.processors[processorId].to = tact + this.tasks[taskId].weight;
    this.processors[processorId].task = taskId;
    this.tasks[taskId].status = RUNNING_STATUS;
    this.queue = this.queue.filter(({ number: id }) => id !== taskId);
    this.result[taskId] = this.result[taskId]
      ? [...this.result[taskId]]
      : {
          values: [
            { x: tact, y: parseInt(processorId) },
            {
              x: tact + this.tasks[taskId].weight,
              y: parseInt(processorId)
            }
          ],
          color: this.colors[taskId]
        };
  };

  _getFreeProcessors = (tact, taskId) => {
    switch (this.algo) {
      case "2":
        return this._getFreeProcessors2(tact);
      case "6":
        return this._getFreeProcessors6(tact, taskId);
      default:
        throw Error(`Algo is not implemented!`);
    }
  };

  _getFreeProcessors6 = (tact, taskId) => {
    const processorIds = Object.keys(this.processors).map(
      processorId => processorId
    );
    const parents = this.tasks[taskId].parents;
    if (Object.keys(parents).length <= 0) return this._getFreeProcessors2(tact);
    const startingTacts = {};
    for (let i = 0; i < processorIds.length; i++) {
      const transmissionInfo = JSON.parse(
        JSON.stringify(this.transmissionInfo)
      );
      const transmissions = JSON.parse(JSON.stringify(this.transmissions));
      const id = processorIds[i];
      // console.error(`Trying on processor: ${id}`);
      const tactCorrelation =
        this.processors[id].status === RUNNING_STATUS
          ? this.processors[id].to
            ? this.processors[id].to
            : 0
          : 0;
      // console.log(`TactCorrelation for ${id} which is has status running ${RUNNING_STATUS === this.processors[id].status}: ${tactCorrelation}`);
      startingTacts[id] = Math.max(
        tactCorrelation,
        this._makeTransmissions(
          taskId,
          id,
          tact,
          transmissionInfo,
          transmissions,
          true
        )
      );

      // Math.max(
      //   ...Object.keys(parents).map(parentId => {
      //     const tactCorrelation =
      //       this.processors[id] === RUNNING_STATUS
      //         ? this.processors[id].end
      //         : 0;
      //     return this.processors[id] === RUNNING_STATUS
      //       ? transmissionStart + tactCorrelation
      //       : transmissionStart;
      //   })
      // );
    }
    console.log(JSON.stringify(startingTacts));
    const minId = Object.keys(startingTacts).reduce(
      (min, cur) => (startingTacts[min] <= startingTacts[cur] ? min : cur),
      processorIds[0]
    );
    const minTact = Math.min(...Object.values(startingTacts));
    console.log(`Min id: ${minId}`);
    if (this.processors[minId].status === RUNNING_STATUS) {
      const free = Object.keys(startingTacts).filter(
        key =>
          this.processors[key].status !== RUNNING_STATUS &&
          startingTacts[key] === minTact
      );
      console.log(`Free: ${JSON.stringify(free)}`);
      if (free.length < 1) return -2;
      else return free[0];
    } else return minId;
  };

  _getFreeProcessors2 = tact => {
    const freeProcessorsIds = Object.keys(this.processors).filter(
      processorId => {
        const processor = this.processors[processorId];
        return (
          processor.status === READY_STATUS ||
          (processor.status === TRANSMISSION_STATUS && processor.to <= tact)
        );
      }
    );
    if (freeProcessorsIds.length === 0) return -1;
    let maxStandBy = -1,
      selectedId = 0;
    Object.values(freeProcessorsIds).forEach(processorId => {
      const processor = this.processors[processorId];
      if (processor.standBy > maxStandBy) {
        maxStandBy = processor.standBy;
        selectedId = processorId;
      }
    });
    return selectedId;
  };

  _getReadyTasks = () => {
    let readyTasks = this.queue.filter(({ number: taskId }) => {
      const task = this.tasks[taskId];
      if (Object.keys(task.parents).length === 0)
        return task.status === READY_STATUS;
      else {
        const preparedParents = [];
        Object.keys(task.parents).forEach(parentId => {
          preparedParents.push(
            this.tasks[parentId].status === FINISHED_STATUS ||
              this.tasks[parentId].status === TRANSMISSION_STATUS
          );
        });
        const isTaskReady = preparedParents.every(parent => parent);
        return isTaskReady;
      }
    });
    readyTasks = readyTasks.map(task => task.number);
    return readyTasks;
  };

  _checkFinish = tact => {
    Object.keys(this.processors).forEach(processorId => {
      const processor = this.processors[processorId];
      if (
        processor.status === RUNNING_STATUS ||
        processor.status === TRANSMISSION_STATUS
      ) {
        if (processor.to === tact) {
          console.log(`Task ${processor.task} finished on ${processorId}`);
          processor.status =
            processor.status === TRANSMISSION_STATUS
              ? TRANSMISSION_STATUS
              : READY_STATUS;
          processor.standBy = 0;
          this.tasks[processor.task].status = FINISHED_STATUS;
        }
      }
    });
  };

  _processorsStandBy = () => {
    Object.keys(this.processors).forEach(processorId => {
      const processor = this.processors[processorId];
      if (
        processor.status === READY_STATUS ||
        processor.status === TRANSMISSION_STATUS
      )
        this.processors[processorId].standBy++;
    });
  };

  model = () => {
    let tact = 0;
    while (this.queue.length !== 0) {
      // while (tact < 50) {
      tact++;
      console.warn(`Tact: ${tact}`);
      console.log(`Processors: ${JSON.stringify(this.processors)}`);
      console.log(`Tasks: ${JSON.stringify(this.tasks)}`);
      console.log(`Queue: ${JSON.stringify(this.queue)}`);
      console.log(`Transmission: ${JSON.stringify(this.transmissionInfo)}`);
      this._checkFinish(tact);
      const tasks = this._getReadyTasks();
      console.log(`Ready tasks: ${JSON.stringify(tasks)}`);
      try {
        if (tasks.length === 0) throw new ExecutionError(`No tasks available!`);
        for (let task of tasks) {
          const freeProcessor = this._getFreeProcessors(tact, task);
          console.log(`Selected processor: ${freeProcessor}`);
          if (freeProcessor === -1)
            throw new ExecutionError(`No free processors`);
          if (freeProcessor === -2) {
            console.warn(`Processor is busy! Waiting...`);
            continue;
          }
          this._executeTask(task, freeProcessor, tact);
        }
      } catch (e) {
        if (e instanceof ExecutionError) console.error(e.message);
        else throw e;
      } finally {
        this._processorsStandBy();
      }
    }
    return { result: this.result, tasks: this.tasks };
  };
}

export default Model;
