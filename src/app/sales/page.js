import React from 'react'
import './style.scss'

export const metadata = {
    title: "Скидки и акции в магазине IqosIluma",
    description: "Скидки и акции в магазине IqosIluma - покупайте премиальные устройства IQOS ILUMA и стики Terea по привлекательным ценам",
    alternates: {
      canonical: `https://iqos-iluma.com/sales`
    },
    openGraph: {
        title: `Скидки и акции в магазине IqosIluma`,
        description: `Скидки и акции в магазине IqosIluma - покупайте премиальные устройства IQOS ILUMA и стики Terea по привлекательным ценам`,
        url: `https://iqos-iluma.com/sales`,
        images: [
            {
                url: `/favicon/web-app-manifest-512x512`,
                alt: `IqosIluma`,
            },
        ],
    },
  };

const Sales = () => {
    return (
        <div className="sales">
            <h1>Акции</h1> 
            <div className='sales-three'>
                <h3>Каждый 11-й блок стиков в подарок!</h3>
                <p>При покупке 10ти блоков - 11й в подарок</p>
            </div>
            
        </div>
    )
}

export default Sales