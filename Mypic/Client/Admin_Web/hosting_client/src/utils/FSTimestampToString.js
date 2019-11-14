export default function (FSTimestamp) {
    try {
        return FSTimestamp.toDate().toISOString().split('T')[0]
    }
    catch (e) {
        return 'N/A'
    }
}