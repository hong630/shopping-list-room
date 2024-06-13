// 현재 도메인을 가져오는 함수
function getBaseUrl() {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
}
function getWsUrl() {
    const { protocol, hostname } = window.location;
    const wsProtocol = protocol === 'https:' ? 'wss' : 'ws';
    const port = hostname === 'localhost' ? ':3001' : ''; // 개발 환경에서는 포트 번호 추가
    return `${wsProtocol}://${hostname}${port}`;
}
export {getBaseUrl, getWsUrl};