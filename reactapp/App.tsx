import React, {PropsWithChildren, useMemo, useState} from 'react';
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    useColorScheme,
    View,
} from 'react-native';

import {fetchData, getDay, getMonday} from './services';

import {Colors,} from 'react-native/Libraries/NewAppScreen';

import jsonrawtoxlsx from "jsonrawtoxlsx";


function downloadAsExcel() {
    const json = [
        {
            name: 'John',
            age: 27,
            job: 'Software Engineer',
        },
    ];

    const buffer = jsonrawtoxlsx(json);
}

function useStyles() {
    const isDarkMode = useColorScheme() === 'dark';
    return useMemo(() => {
        const style = StyleSheet.create({
            backgroundStyle: {
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }, sectionContainer: {
                backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
                margin: 16,
                marginBottom: 0,
                padding: 16,
                borderRadius: 4
            }, sectionTitle: {
                fontSize: 24, fontWeight: '600',
            }, sectionContent: {
                marginTop: 8, fontSize: 18, fontWeight: '400',
            }, priceRow: {
                marginTop: 8, fontSize: 18, display: "flex", flexDirection: 'row', gap: 8,
            }, priceTime: {
                flexBasis: 100,
            }, priceValue: {
                flexBasis: 150, textAlign: 'right'
            }, actionsContainer: {
                marginTop: 8, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8, columnGap: 16
            }, valueDisplay: {
                fontSize: 16, paddingVertical: 8,
            }, valueLabel: {
                fontWeight: '200'
            },

            button: {
                fontWeight: '800',
                fontSize: 16,
                paddingVertical: 8,
                color: 'darkblue'
            },
            input: {},
            inputLabel: {}
        });
        return {styles: style, isDarkMode};
    }, [isDarkMode]);
}

type SectionProps = PropsWithChildren<{
    title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
    const {styles} = useStyles();
    return (<View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionContent}>{children}</View>
    </View>);
}

const formatDate = new Intl.DateTimeFormat(undefined, {dateStyle: 'full'}).format;
const formatTime = new Intl.DateTimeFormat(undefined, {timeStyle: 'short'}).format;
const formatFull = new Intl.DateTimeFormat(undefined, {timeStyle: 'short', dateStyle: 'short'}).format;


function PriceRow({price, stats, lowLimit}: { price: any, stats: PriceStats, lowLimit: number }): React.JSX.Element {
    const {styles, isDarkMode} = useStyles();
    const {min, max} = stats;
    const scale = 1 - ((price.marketprice - min) / (max - min));

    const priceStyle: TextStyle = {
        fontWeight: price.marketprice <= lowLimit ? '900' : 'normal',
        color: isDarkMode ? `rgb(${(125 + (1 - scale) * 125).toFixed(0)}, 255, ${(125 + (1 - scale) * 125).toFixed(0)})` : `rgb(0, ${(scale * 125).toFixed(0)}, 0)`
    }

    return (<View style={styles.priceRow}>
        <Text style={styles.priceTime}>{formatTime(price.start)}</Text>
        <Text style={styles.priceTime}>{formatTime(price.end)}</Text>
        <Text style={[styles.priceValue, priceStyle]}>{price.marketprice.toFixed(2) + ' ' + price.unit}</Text>
    </View>);
}

function StatDisplay({label, value}: { label: string, value: string }): React.JSX.Element {
    const {styles} = useStyles();
    return (<View style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        <Text style={styles.valueLabel}>{label}</Text>
        <Text style={styles.valueDisplay}>{value}</Text>
    </View>);
}

function InputField({label, value, onChange}: {
    label: string, value: string | number, onChange: (value: string) => void
}): React.JSX.Element {
    const {styles} = useStyles();
    return (<View style={{display: 'flex', flexDirection: 'column', gap: 4}}>
        <Text style={styles.valueLabel}>{label}</Text>
        {/*<Text style={styles.valueDisplay}>{value}</Text>*/}
        <TextInput
            style={styles.valueDisplay}
            onChangeText={onChange}
            value={`${value}`}
            keyboardType="numeric"
        />
    </View>);
}


type DataByDays = {
    title: string, date: Date, data: any[]
}

type PriceState = DataByDays[];
type PriceStats = { min: number, minData?: any, max: number, maxData?: any };

function App(): React.JSX.Element {
    const {styles, isDarkMode} = useStyles();
    const {backgroundStyle} = styles;

    const [lowPerc, setLowPerc] = useState(10);

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<PriceState>([]);
    const [stats, setStats] = useState<PriceStats>({min: 0, max: 1});

    const lowLimit = (stats.max - stats.min) * lowPerc / 100 + stats.min;

    const itemsBelowLimit = data.flatMap(a => a.data.filter(item => item.marketprice <= lowLimit));

    const fetchPrices = async (from: Date, to: Date) => {
        setIsLoading(true);
        const data = await fetchData(from, to);
        if (!data || !data.length) {
            setData([]);
            setIsLoading(false);
            return
        }

        const calc = {min: data[0].marketprice, minData: data[0], maxData: data[0], max: data[0].marketprice};
        const days = new Map<string, DataByDays>();
        for (const item of data) {
            const key = formatDate(item.start);
            if (!days.has(key)) {
                days.set(key, {title: key, date: item.start, data: [item]})
            } else {
                days.get(key)!.data.push(item);
            }
            if (calc.min > item.marketprice) {
                calc.min = item.marketprice;
                calc.minData = item;
            }
            if (calc.max < item.marketprice) {
                calc.max = item.marketprice;
                calc.maxData = item;
            }
        }
        setData(Array.from(days.values()));
        setIsLoading(false);
        setStats(calc);
    }

    return (<SafeAreaView style={{...backgroundStyle, flex: 1}}>
        <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={{...styles.sectionContainer, margin: 0, borderBottomColor: Colors.black }}>
            <Text style={styles.sectionTitle}>Energy Prices</Text>
            <View style={{...styles.sectionContent, paddingBottom: 8 }}>
                <Text>Read electricity prices from providers, tomorrows future values are published at today
                    14:00.</Text>
                <View style={styles.actionsContainer}>
                    <Text style={styles.button} onPress={() => fetchPrices(new Date(), getDay(1, true))}>Future</Text>
                    <Text style={styles.button} onPress={() => fetchPrices(getDay(0), getDay(1, true))}>Today and Future</Text>
                    <Text style={styles.button} onPress={() => fetchPrices(getMonday(0), getDay(1, true))}>This week</Text>
                    <Text style={styles.button} onPress={() => fetchPrices(getMonday(-7), getMonday(-1, true))}>Last week</Text>
                    <Text style={styles.button} onPress={() => fetchPrices(getDay(-30), getDay(0, true))}>Last 30 days</Text>
                </View>
                {data.length && stats.minData && stats.maxData ? <View style={styles.actionsContainer}>
                    <StatDisplay label="Min price"
                                 value={stats.minData.marketprice.toFixed(0) + ' ' + stats.minData.unit + ' at ' + formatFull(stats.minData.start)}></StatDisplay>
                    <StatDisplay label="Highest price"
                                 value={stats.maxData.marketprice.toFixed(0) + ' ' + stats.maxData.unit + ' at ' + formatFull(stats.maxData.start)}></StatDisplay>
                </View> : null}
                <View style={styles.actionsContainer}>
                    <InputField label="Low Limit Percentil" value={lowPerc.toFixed(0)}
                                onChange={(value) => setLowPerc(value ? parseInt(value, 10) : 0)}></InputField>
                    <StatDisplay label="Lowest value Limit" value={lowLimit.toFixed(3)}></StatDisplay>
                    <StatDisplay label="Prices below Limit" value={itemsBelowLimit.length.toFixed(0)}></StatDisplay>
                </View>
            </View>
        </View>
        {isLoading ? <Section title="Loading..."></Section> :
        <FlatList
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}
            data={data}
            keyExtractor={(item) => item.title}
            renderItem={({item}) => (<Section key={item.title} title={item.title}>
                {item.data.map(item => <PriceRow key={item.start} price={item} stats={stats} lowLimit={lowLimit}/>)}
            </Section>)}/>
        }
    </SafeAreaView>);
}


export default App;
