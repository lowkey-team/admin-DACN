import classNames from 'classnames/bind';
import style from './Button.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(style);
function Button({ to, href, edit, deleted, update, children, onClick, ...passRrops }) {
    let Comp = 'button';
    const rprop = {
        onClick,
        ...passRrops,
    };

    if (to) {
        rprop.to = to;
        Comp = Link;
    } else if (href) {
        rprop.href = href;
        Comp = 'a';
    }
    const classes = cx('wrapper', {
        edit,
        deleted,
        update,
    });
    return (
        <Comp className={classes} {...rprop}>
            <span>{children}</span>
        </Comp>
    );
}

export default Button;
