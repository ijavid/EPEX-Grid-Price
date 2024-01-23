import React, {PropsWithChildren} from "react";
import {PriceStats} from "../types";
import {Card, InputNumber} from "antd";
import {createStyles} from 'antd-style';
import {useFormat} from "../hooks/useFormat";

export const useStyles = createStyles(({token, css}) => {
    return {
        sectionContainer: {
            margin: 16, marginBottom: 0, padding: 16, borderRadius: 4
        }, sectionTitle: {
            fontSize: 24, fontWeight: '600',
        }, sectionContent: {
            fontSize: 18, fontWeight: '400',
        }, priceRow: {
            marginTop: 8, fontSize: 18, display: "flex", flexDirection: 'row', gap: 8,
        }, priceTime: {
            flexBasis: 100,
        }, priceValue: {
            flexBasis: 150, textAlign: 'right'
        }, actionsContainer: {
            paddingTop: 8, paddingBottom: 8,  display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8, columnGap: 16
        }, valueDisplay: {
            fontSize: 14,  paddingTop: 8, paddingBottom: 8,
        }, valueLabel: {
            fontWeight: '200'
        }, button: {

        }, input: {}, inputLabel: {}
    }
});

export function Section({children, title}: PropsWithChildren<{
    title: string;
}>): React.JSX.Element {
    const {styles} = useStyles();
    return (<Card title={title} style={{ margin: 16 }}>
        <div className={styles.sectionContent}>{children}</div>
    </Card>);
}


export function PriceRow({price, stats, lowLimit}: {
    price: any, stats: PriceStats, lowLimit: number
}): React.JSX.Element {
    const { formatTime } = useFormat();
    const {styles, theme} = useStyles();
    const {min, max} = stats;
    const scale = 1 - ((price.marketprice - min) / (max - min));

    const priceStyle = {
        fontWeight: price.marketprice <= lowLimit ? '900' : 'normal',
        color: theme.isDarkMode ? `rgb(${(125 + (1 - scale) * 125).toFixed(0)}, 255, ${(125 + (1 - scale) * 125).toFixed(0)})` : `rgb(0, ${(scale * 125).toFixed(0)}, 0)`
    }

    // console.log(theme);

    return (<div className={styles.priceRow}>
        <div className={styles.priceTime}>{formatTime(price.start)}</div>
        <div className={styles.priceTime}>{formatTime(price.end)}</div>
        <div className={styles.priceValue} style={priceStyle}>{price.marketprice.toFixed(2) + ' ' + price.unit}</div>
    </div>);
}

export function StatDisplay({label, value}: { label: string, value: string }): React.JSX.Element {
    const {styles} = useStyles();
    return (<div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        <div className={styles.valueLabel}>{label}</div>
        <div className={styles.valueDisplay}>{value}</div>
    </div>);
}

export function InputField({label, value, onChange}: {
    label: string, value: number, onChange: (value: number) => void
}): React.JSX.Element {
    const {styles} = useStyles();
    return (<div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        <div className={styles.valueLabel}>{label}</div>
        <InputNumber min={1} max={100} defaultValue={value} onChange={onChange}/>
    </div>);
}
