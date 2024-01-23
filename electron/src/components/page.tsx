import {Button, DatePicker, Space, Typography} from "antd";
import {InputField, PriceRow, Section, StatDisplay, useStyles, } from "./index";
import { getDay, getMonday} from "../services";
import React, {useEffect, useState} from "react";
import {useData} from "../hooks/useData";
import {useFormat} from "../hooks/useFormat";
import dayjs from "dayjs";

const {saveExcel} = (window as any).bridge as { saveExcel: (args: any) => Promise<any> }

const Page: React.FC = () => {
    const {styles} = useStyles();
    const { formatDate, formatFull } = useFormat();
    const [ dates, setDates ] = useState<[ dayjs.Dayjs, dayjs.Dayjs ]>() // Future
    const {fetchPrices, data, stats, lowPerc, setLowPerc, lowLimit, itemsBelowLimit, isLoading,} = useData();

    const presetDates = (date1: Date, date2: Date) => {
        setDates([dayjs(date1), dayjs(date2)] );
    }

    useEffect(() => {
        if(dates) {
            fetchPrices(dates[0].toDate(), dates[1].toDate())
        }
    }, [dates])

    function download() {
        saveExcel(data);
    }

    return (<Space direction="vertical" size="middle" style={{display: 'flex', height: '100%' }}>
            <div className={styles.sectionContainer} style={{margin: 0}}>
                <Typography.Title className={styles.sectionTitle}>Energy Prices</Typography.Title>
                <div >
                    <Typography.Paragraph>
                        Read electricity prices from providers, tomorrows future values are published at today
                        14:00.</Typography.Paragraph>

                    <div className={styles.actionsContainer} style={{marginBottom: 16}}>
                        <Button className={styles.button}
                                onClick={() => presetDates(new Date(), getDay(1, true))}>Future</Button>
                        <Button className={styles.button} onClick={() => presetDates(getDay(0), getDay(1, true))}>Today
                            and
                            Future</Button>
                        <Button className={styles.button} onClick={() => presetDates(getMonday(0), getDay(1, true))}>This
                            week</Button>
                        <Button className={styles.button}
                                onClick={() => presetDates(getMonday(-7), getMonday(-1, true))}>Last
                            week</Button>
                        <Button className={styles.button} onClick={() => presetDates(getDay(-30), getDay(0, true))}>Last
                            30
                            days</Button>
                        <DatePicker.RangePicker showTime={{ format: 'HH' }} value={dates} onChange={setDates}/>
                    </div>



                    {data.length && stats.minData && stats.maxData ? <>
                        <div className={styles.actionsContainer} style={{marginBottom: 16}}>
                            <StatDisplay label="Min price"
                                         value={stats.minData.marketprice.toFixed(0) + ' ' + stats.minData.unit + ' at ' + formatFull(stats.minData.start)}></StatDisplay>
                            <StatDisplay label="Highest price"
                                         value={stats.maxData.marketprice.toFixed(0) + ' ' + stats.maxData.unit + ' at ' + formatFull(stats.maxData.start)}></StatDisplay>

                            <InputField label="Low Limit Percentil" value={lowPerc}
                                        onChange={(value) => setLowPerc(value)}></InputField>
                            <StatDisplay label="Lowest value Limit" value={lowLimit.toFixed(3)}></StatDisplay>
                            <StatDisplay label="Prices below Limit"
                                         value={itemsBelowLimit.length.toFixed(0)}></StatDisplay>
                        </div>

                        <div className={styles.actionsContainer} style={{marginBottom: 16}}>
                            <Button className={styles.button}
                                    onClick={() => download()}>Download</Button>
                        </div>

                    </> : null}
                </div>
            </div>

        {isLoading ? <Section title="Loading..."/> : <>
            {data.map(day => <Section key={formatDate(day.date)} title={formatDate(day.date)}>
                {day.data.map(item => <PriceRow key={item.start.toISOString()} price={item} stats={stats} lowLimit={lowLimit}/>)}
            </Section>)}
        </>}
    </Space>)
}

export default Page;
