import { useState, useEffect } from 'react';

interface IProps {
    time: number;
    onEnd: Function;
}

const CountDown = (props: IProps) => {
    const { time, onEnd } = props;
    const [count, setCount] = useState(time || 60);

    // 利用useEffect接收一个数组作为第二个参数，将第二个参数作为dependence，每次渲染完DOM执行副作用函数时都会浅比较dependence渲染前后的值是否一致，不一致就执行副作用，反之就不执行；
    // 如果该dependence为一个空数组[]，即没有传入比较变化的变量，则比较结果永远都保持不变，那么副作用逻辑就只能执行一次。
    useEffect(() => {
        let timer: any = null;
        if (count > 0) {
            timer = setTimeout(() => {
                setCount(count - 1);
            }, 1000);
        } else {
            onEnd && onEnd();
            clearTimeout(timer);
        }
        return () => {
            clearTimeout(timer);
        };
    });

    useEffect(() => {
        setCount(count);
    }, [time]);

    return <div>{count}</div>;
};

export default CountDown;
