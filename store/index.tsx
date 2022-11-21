import React, { createContext, ReactElement, useContext } from "react";
import { observer, useLocalObservable, enableStaticRendering } from "mobx-react-lite";
import createStore, { IStore } from "./rootStore";
// enableStaticRendering 在 ssr 项目里面设置为 true
// useLocalObservable 创建可被观察到的响应式的数据
interface IProps {
    initialValue: Record<any, any>
    children: ReactElement,
};

// 判断当前是否为客户端的 process.browser, 但是已经被 deprecated — Use typeof window instead
// ssr 环境数据是静态的，所以不需要动态响应
enableStaticRendering(typeof window === 'undefined');

// createContext 防止父子组件频繁向下传递数据，便于深层级的子组件获取数据，可以在子组件任何地方获取context下面的数据
const StoreContext = createContext({});

export const StoreProvider = ({initialValue, children}: IProps) => {
    // createStore({initialValue}) 类型是 () => IStore
    const store: IStore = useLocalObservable(createStore(initialValue));
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    )
}

export const useStore = () => {
    // useContext 可以拿到 context 下面的数据信息
    const store: IStore = useContext(StoreContext) as IStore;
    if(!store) {
        throw new Error('数据不存在');
    }
    return store;
}
