import styles from './header.module.scss'
import logo from '../../assets/images/logo.png'
export default function Header(){
    return(
        <header>
            <div className={styles.logo}>
               <img src={logo}  alt="Logo da taverna do dragão adormecido"  loading="lazy"/>
            </div>
            <h1>Taverna do dragão adormecido</h1>
        </header>
    )
}