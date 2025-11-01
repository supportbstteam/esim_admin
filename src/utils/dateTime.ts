import moment from "moment"

export const ddmmyyyy = (date) => {
    return moment(date).local().format('DD/MM/YYYY')
}