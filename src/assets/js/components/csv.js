/*
  返回这种字符串
  名称,展示,唤醒,登录,点击,激活,7日留存,30日留存,次日留存,日活跃,周活跃,月活跃
  推广名称1,7302,5627,1563,4254,1438,274,285,1727,558,4440,5610
  推广名称2,4720,4086,3792,8690,8470,8172,5197,1684,2593,2507,1537
  推广名称3,7181,8007,8477,1879,16,2249,3450,377,1561,3219,1588
  推广名称4,9911,8976,8807,8050,7668,1547,2357,7278,5309,1655,9043
  推广名称5,934,1394,6463,5278,9256,209,3563,8285,1230,4840,9908
  推广名称6,6856,1608,457,4949,2909,4525,6171,1920,1966,904,6851
  推广名称7,5107,6407,4166,7970,1002,8701,9040,7632,4061,4359,3676
*/

const newLine = '\r\n';
const appendLine = (content, row, { separator, quoted }) => {
    const line = row.map(data => {
        if (!quoted) return data;
        // quote data
        data = typeof data === 'string' ? data.replace(/"/g, '"') : data;
        return `"${data}"`;
    });
    content.push(line.join(separator));
};

const defaults = {
    separator: ',',
    quoted: false
};

export default function csv(columns, datas, options, noHeader = false) {
    options = Object.assign({}, defaults, options);
    let columnOrder;
    const content = [];
    const column = [];

    if (columns) {
        columnOrder = columns.map(v => {
            if (typeof v === 'string') return v;
            if (!noHeader) {
                column.push(typeof v.title !== 'undefined' ? v.title : v.key);
            }
            return v.key;
        });
        if (column.length > 0) appendLine(content, column, options);
    } else {
        columnOrder = [];
        datas.forEach(v => {
            if (!Array.isArray(v)) {
                columnOrder = columnOrder.concat(Object.keys(v));
            }
        });
        if (columnOrder.length > 0) {
            columnOrder = columnOrder.filter((value, index, self) => self.indexOf(value) === index);
            if (!noHeader) appendLine(content, columnOrder, options);
        }
    }

    if (Array.isArray(datas)) {
        datas.forEach(row => {
            if (!Array.isArray(row)) {
                row = columnOrder.map(k => (typeof row[k] !== 'undefined' ? row[k] : ''));
            }
            appendLine(content, row, options);
        });
    }
    return content.join(newLine);
}
