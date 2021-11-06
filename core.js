
export default function html([first, ...strings], ...values) {
    return values.reduce(
        (acc, cur) => acc.concat(cur, strings.shift()),
        [first]
    )
    .filter(x => x && x !== true || x === 0) // lọc loại bỏ true/false, chỉ nhận khác true và số 0
    .join('');
}

export function createStore(reducer) {
    let state = reducer();
    const roots = new Map();

    function render() {
        for (const [root, component] of roots) {
            const output = component();
            root.innerHTML = output;
        }
    }

    return {
        // nhận thông tin và truyền dữ liệu vào roots, sau đó render ra html
        attach(component, root) {
            roots.set(root, component);
            render();
        },
        // connect store với view
        connect(selector = state => state) {
            return component => (props, ...args) => 
                component(Object.assign({}, props, selector(state), ...args));
        },
        // nhận hành động và đẩy qua cho reducer
        dispatch(action, ...args) {
            state = reducer(state, action, args);
            render();
        } 
    };
}