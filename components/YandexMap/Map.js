
"use client"
import {YMaps, Map, Placemark} from '@pbe/react-yandex-maps'
import dynamic from 'next/dynamic'

const YandexMap = () => {
    console.log('YandexMap component rendered'); 
    try{
        return(
            <>
                <YMaps>
                    <div className='ymaps'>
                            <Map className='map' defaultState={{ center: [55.875925, 37.603424], zoom: 13.5 }}>
                                <Placemark geometry={[55.875925, 37.603424]}  options={{preset: 'islands#darkBlueDotIcon'}} />
                            </Map>
                    </div>  
                    
                </YMaps>
            </>
        )
    }catch (error) {
        console.error('Error rendering YandexMap:', error);
    }
    
    
}


export default dynamic(() => Promise.resolve(YandexMap), { ssr: false })