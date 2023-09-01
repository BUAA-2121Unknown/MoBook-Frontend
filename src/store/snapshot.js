import store from "./index";
import { deepCopy } from "@/utils/design/utils";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

// 设置画布默认数据 https://github.com/woai3c/visual-drag-demo/issues/92
let defaultcomponentData = [];
function getDefaultcomponentData() {
    return JSON.parse(JSON.stringify(defaultcomponentData));
}

export function setDefaultcomponentData(data = []) {
    defaultcomponentData = data;
}

export default {
    state: {
        snapshotData: [], // 编辑器快照数据
        snapshotIndex: -1, // 快照索引

        // 存储在线协作数组
        dataArray: [],
    },
    mutations: {
        undo(state) {
            if (state.snapshotIndex >= 0) {
                state.snapshotIndex--;
                const componentData =
                    deepCopy(state.snapshotData[state.snapshotIndex]) ||
                    getDefaultcomponentData();
                if (state.curComponent) {
                    // 如果当前组件不在 componentData 中，则置空
                    const needClean = !componentData.find(
                        (component) => state.curComponent.id === component.id
                    );

                    if (needClean) {
                        store.commit("setCurComponent", {
                            component: null,
                            index: null,
                        });
                    }
                }

                store.commit("setComponentData", componentData);
                // cola 最后，上传这个快照至共享数组
                store.commit("setDataArray", componentData, state.canvasStyleData);
            }
        },

        redo(state) {
            if (state.snapshotIndex < state.snapshotData.length - 1) {
                state.snapshotIndex++;
                store.commit(
                    "setComponentData",
                    deepCopy(state.snapshotData[state.snapshotIndex])
                );
                // cola 最后，上传这个快照至共享数组
                store.commit("setDataArray", state.componentData, state.canvasStyleData);
            }
        },
        // cola 在添加快照时提交！！
        recordSnapshot(state) {
            // 添加新的快照
            state.snapshotData[++state.snapshotIndex] = deepCopy(state.componentData);
            // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
            if (state.snapshotIndex < state.snapshotData.length - 1) {
                state.snapshotData = state.snapshotData.slice(
                    0,
                    state.snapshotIndex + 1
                );
            }
            // cola 最后，上传这个快照至共享数组
            store.commit("setDataArray", state.componentData, state.canvasStyleData);
        },

        initDataArray(state, dataArray){
            state.dataArray = dataArray
        },
        // cola 用指定数据更新共享数组
        setDataArray(state, cd = [], csd = {}) {
            if (!state.dataArray) {
                return;
            }
            const dataArray = state.dataArray;
            // 防止传空数据
            let componentData = cd ? cd : state.componentData;
            let canvasStyleData =
                JSON.stringify(csd) === "{}" ? state.canvasStyleData : csd;

            dataArray.delete(0, dataArray.length);
            dataArray.insert(0, [
                JSON.stringify(componentData),
                JSON.stringify(canvasStyleData),
            ]);
            console.log("原型设计协作：尝试更新dataArray", dataArray);
        },
    },
};
