/* ############################################# */
/* Email sended for reset-password, style/format */
/* ############################################# */
/**
 * @param {string} resetLink
 * @param {string} userName
 * @returns {string}
*/

"use strict";

function htmlMail(resetLink, userName) {
    // Image at header of the email hard-coded
    const logo = "https://media.licdn.com/dms/image/C4D0BAQGcCakBNsoUyw/company-logo_200_200/0/1554238141789?e=1701302400&v=beta&t=tcHx9Hh0Yl8QQ1nEroi8UxmN-8Ed8-R8Guqze_OlFtQ";

    // Style added directly as HTML
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
            <img src=${logo} alt="Logo de la empresa" style="width: 100px; height: auto; margin-bottom: 20px;">
            <h1>Hola, ${userName}</h1>
            <p style="font-size: 18px; margin-bottom: 20px;">Has solicitado restablecer tu contraseña.
            <br> 
            Haz clic en el siguiente enlace para restablecerla:</p>
            <p><a href="${resetLink}" style="background-color: #51a7b5; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Restablecer Contraseña</a></p>
            <br>
            <p>Si no has solicitado esto, por favor ignora este correo electrónico.</p>
        </div>
    `;
};

module.exports = htmlMail;