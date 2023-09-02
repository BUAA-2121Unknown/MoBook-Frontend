import * as Vue from "vue";
import * as Vuex from "vuex";
import animation from "./animation";
import compose from "./compose";
import contextmenu from "./contextmenu";
import copy from "./copy";
import event from "./event";
import layer from "./layer";
import snapshot from "./snapshot";
import lock from "./lock";
import { setTimeout } from "core-js";

const data = {
    state: {
        ...animation.state,
        ...compose.state,
        ...contextmenu.state,
        ...copy.state,
        ...event.state,
        ...layer.state,
        ...snapshot.state,
        ...lock.state,

        editMode: "edit", // 编辑器模式 edit preview
        canvasStyleData: {
            // 页面全局数据
            width: 1200,
            height: 740,
            scale: 100,
            color: "#000",
            opacity: 1,
            background: "#fff",
            fontSize: 14,
        },
        isInEdiotr: false, // 是否在编辑器中，用于判断复制、粘贴组件时是否生效，如果在编辑器外，则无视这些操作
        componentData: [], // 画布组件数据
        curComponent: null,
        curComponentIndex: null,
        // 点击画布时是否点中组件，主要用于取消选中组件用。
        // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
        isClickComponent: false,
        canvasDOM: {},

        userId: 0,
    },
    mutations: {
        ...animation.mutations,
        ...compose.mutations,
        ...contextmenu.mutations,
        ...copy.mutations,
        ...event.mutations,
        ...layer.mutations,
        ...snapshot.mutations,
        ...lock.mutations,

        aceSetCanvasData(state, value) {
            state.canvasStyleData = value;
        },

        aceSetcurComponent(state, value) {
            for (let i = 0; i < state.componentData.length; i++) {
                if (state.componentData[i].id === value.id) {
                    state.componentData.splice(i, 1);
                }
            }
            state.componentData.push(value);
            state.curComponent = value;
        },

        setCanvasDOM(state, dom) {
            state.canvasDOM = dom;
        },

        setClickComponentStatus(state, status) {
            state.isClickComponent = status;
        },

        setEditMode(state, mode) {
            state.editMode = mode;
        },

        setInEditorStatus(state, status) {
            state.isInEdiotr = status;
        },

        setCanvasStyle(state, style) {
            state.canvasStyleData = style;
        },

        setUserId(state, id) {
            state.userId = id;
        },
        // // 设置当前组件
        // setCurComponent(state, { component, index }) {
        //     state.curComponent = component;
        //     state.curComponentIndex = index;
        //     if (state.curComponent) {
        //         state.curComponent.userId = state.userId;
        //     }
        // },
        // 设置当前组件
        setCurComponent(state, { component, index }) {
            console.log("触发了当前组件设置函数", component, state.curComponent);
            // state.curComponent = component;
            // state.curComponentIndex = index;
            // if(state.curComponent){
            //     state.curComponent.userId = state.userId;
            // }
            // 如果要选取一个被锁定的元素
            if (
                component &&
                component.userId != 0 &&
                component.userId != state.userId
            ) {
                return;
            }
            // 如果要释放一个被锁定的元素
            if (state.curComponent && state.curComponent.userId == state.userId) {
                state.componentData[state.curComponentIndex].userId = 0
                state.curComponent.userId = 0;
                console.log("已释放当前元素", state.componentData, state.componentData[state.curComponentIndex].userId, state.curComponent.userId);
            }

            state.curComponent = state.componentData[index];
            state.curComponentIndex = index;
            // 如果要选取一个未锁定的元素
            if (component) {
                state.curComponent.userId = state.userId;
                console.log(
                    "已设置当前组件并锁定",
                    state.curComponent,
                    state.componentData
                );
                // return;
            }
            // // 提交更改
            state.dataArray.delete(0, state.dataArray.length);
            state.dataArray.insert(0, [
                JSON.stringify(state.componentData),
                JSON.stringify(state.canvasStyleData),
            ]);
            console.log("设置选择的组件：完成更新dataArray", state.dataArray);
            
            if (component) {
                state.curComponent = state.componentData[index];
                console.log(
                    "二轮更新dataArray",
                    state.curComponent,
                    state.componentData
                );
            }
        },

        setShapeStyle({ curComponent }, { top, left, width, height, rotate }) {
            if (top !== undefined) curComponent.style.top = Math.round(top);
            if (left !== undefined) curComponent.style.left = Math.round(left);
            if (width) curComponent.style.width = Math.round(width);
            if (height) curComponent.style.height = Math.round(height);
            if (rotate) curComponent.style.rotate = Math.round(rotate);
            // console.log("尝试移动", curComponent, left);
        },

        setShapeSingleStyle({ curComponent }, { key, value }) {
            curComponent.style[key] = value;
        },

        setComponentData(state, componentData = []) {
            state["componentData"] = componentData;
        },

        addComponent(state, { component, index }) {
            if (index !== undefined) {
                state.componentData.splice(index, 0, component);
            } else {
                state.componentData.push(component);
            }
        },

        deleteComponent(state, index) {
            if (index === undefined) {
                index = state.curComponentIndex;
            }

            if (index == state.curComponentIndex) {
                state.curComponentIndex = null;
                state.curComponent = null;
            }

            if (/\d/.test(index)) {
                state.componentData.splice(index, 1);
            }
        },
    },
};

export default Vuex.createStore(data);
