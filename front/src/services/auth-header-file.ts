export default function authHeaderFile() {
    let storedUser:any = localStorage.getItem('user')
    let user = JSON.parse(storedUser)
    if (user && user.JWT) {
        return 'Bearer ' + user.JWT ;
    } else {
        return '';
    }
}