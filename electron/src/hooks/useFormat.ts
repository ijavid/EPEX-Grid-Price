import {ConfigProvider} from "antd";
import React, {useMemo} from "react";

export const useFormat = () => {
    const { locale } = React.useContext(ConfigProvider.ConfigContext);
    return useMemo(() => {
        const formatDate = new Intl.DateTimeFormat(locale.locale, {dateStyle: 'full'}).format;
        const formatTime = new Intl.DateTimeFormat(locale.locale, {timeStyle: 'short'}).format;
        const formatFull = new Intl.DateTimeFormat(locale.locale, {timeStyle: 'short', dateStyle: 'short'}).format;
        return {
            formatDate,
            formatFull,
            formatTime
        }
    }, [locale.locale]);

}
