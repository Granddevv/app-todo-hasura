import React from 'react';

export default function Input(props) {
    const { label, wrapClass, inputClass, labelClass } = props;

    return (
        <div className={wrapClass}>
            <p className={labelClass}>{label}:</p>
            <input className={inputClass} {...props} />
        </div>
    )
}