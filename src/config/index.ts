export const EVERY_90_MINUTES_BETWEEN_8PM_AND_11PM = '0 */90 20-23 * * *'
export const EMAIL_RECOVER = `<p><b>Clickea el siguiente enlace para reestablecer tu contraseña</b></p>
                              <a href="http://localhost:3000/recoverpass-enterpass/{user}">Reestablecer contraseña</a>`
export const EMAIL_VERIFY = `<p><b>Hola {name} Clickea el siguiente enlace para validar tu email</b></p>
                             <a href="http://localhost:4000/api/user/confirm/{emailStateHash}">Verificar Email</a>`
export const EMAIL_REMINDER = `<p><b>Hola {name} Te recordamos que tienes la siguiente reserva en nuestro resto</b></p>
                               <div className='select-container bg-white'>
                                    <p><b>Dia: </b> {dia}</p>
                                    <p><b>Hora: </b> {hora}</p>
                                    <p><b>Cantidad de personas: </b> {personas}</p>
                                </div>`
export const EMAIL_CONFIRMED = 'http://localhost:3000/email-confirmed'
export const EMAIL_ERROR = 'http://localhost:3000/email-error'
