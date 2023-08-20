export const genQR = (address: string) => {
    return `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${address}&choe=UTF-8`
}