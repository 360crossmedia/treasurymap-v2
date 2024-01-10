"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react';
//import './TreasuryMap.module.css'
import staticdata from './staticdata.json'


const TreasuryMap = () => {
  const mapCenterTitle = 'https://res.cloudinary.com/dq7aof6vb/image/upload/v1704675764/the-treasury-tech-landscape-title_g8yzli.png';
  const mapBackgroundImage = 'https://res.cloudinary.com/dq7aof6vb/image/upload/v1704675763/background_gs0j76.webp'

  const categories = {
    'category-1': 'FIDP (Financial Instrument Dealing Platform)',
    'category-2': 'FDF (Financial Data Feeding)',
    'category-3': 'CMA (Currency Management Automation)',
    'category-4': 'Integrators',
    'category-5': 'OTS (Other Treasury Solutions)',
    'category-6': 'TRMS (Treasury Risk Management System)',
    'category-7': 'ERP (Enterprise Resource Planing)',
    'category-8': 'Outsourcing',
    'category-9': 'ETL (Extract Transform Load)',
    'category-10': 'FSC (Financial Supply Chain)',
    'category-11': 'CFF (Cash-Flow Forecasting)',
    'category-12': 'eBAM (electronic Bank Account Management)',
    'category-13': 'BSG (Bank Single gateway)',
    'category-14': 'TR (Treasury Reporting)',
  }


  const [mapData, setMapData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectCategoryOpen, setSelectCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scaleMobileIcons, setScaleMobileIcons] = useState(1);

  const [filtersConfig, setFiltersConfig]= useState({
    keywords: {
      open: false,
      title: 'Keywords',
      placeholder: 'Type keyword',
      allFilters: [],
      selectedFilters: [],
    }, 
    subcategories: {
      open: false,
      title: 'Sub-Category',
      placeholder: 'Select sub-category',
      allFilters: [],
      selectedFilters: [],
    },
    headequarterLocation: {
      open: false,
      title: 'Headquarter location',
      placeholder: 'Select headquarter location',
      allFilters: [],
      selectedFilters: [],
    },
    activeIn: {
      open: false,
      title: 'Active in',
      placeholder: 'Select active',
      allFilters: [],
      selectedFilters: [],
    },
  });

  const [resettingFrontLogos, setResettingFrontLogos] = useState(false);
  const [subcategoriesData, setSubcategoriesData, ] = useState([]) ;
  const [activeinData, setActiveinData ] = useState([]) ; 
  const [ allCompData, setAllCompData ] = useState([])


  // ? LOGICA DE LA BARRA DE BUSQUEDA ----------------------
  
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState([]); 
  const [isInitialMount,setIsInitialMount] = useState(true); 
  const [renderSearched, setRenderSearched] = useState('')

  const handleSearch = () => {
    const searchResult = allCompData
      .filter(item => item.keywords.includes(searchTerm.toLowerCase()))
      .map(item => item.id);
    setResult(searchResult);

  };

  useEffect(() => {

    if (isInitialMount) {
      setIsInitialMount(false)
    } else {
      
      if(result.length > 0){
        selectFilter('keywords', result)
        setRenderSearched(searchTerm)
        setSearchTerm('')
      } else{
        alert('No matches found');
      }

    }
    

  }, [result]);

  // ? LOGICA DE LA BARRA DE BUSQUEDA ----------------------


  // Your fetchDataFromAPI implementation
  const fetchDataFromAPI = async () => {
    
    const apiUrl = 'https://treasurymapbackend-production.up.railway.app/api/v1/mapdata';
    //const apiUrl = 'data.json';

    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setMapData(data);
        //console.log(data);
        return data;
      })
      .catch(error => {
        console.error('Error fetching data from API:', error);
      });
  };

  // Fetch the data for the subcategories list
  const fetchSubcategories = async () => {

    const subFetchDataURL = 'https://treasurymapbackend-production.up.railway.app/api/v1/subCategories'
    
    return fetch(subFetchDataURL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setSubcategoriesData(data);
        //console.log(data);
        return data;
      })
      .catch(error => {
        console.error('Error fetching data from API:', error);
      });

  }
  // Fetch the data for the asctiveIn list
  const fetchActiveInData = async () => {

    const activeInFetchDataURL = 'https://treasurymapbackend-production.up.railway.app/api/v1/countries'
    
    return fetch(activeInFetchDataURL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setActiveinData(data);
        //console.log(data);
        return data;
      })
      .catch(error => {
        console.error('Error fetching data from API:', error);
      });

  }

  const fetchAllCompaniesData = async () => {

    const companiesDataURL = 'https://treasurymapbackend-production.up.railway.app/api/v1/companies'
    
    return fetch(companiesDataURL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setAllCompData(data);
        //console.log(data);
        return data;
      })
      .catch(error => {
        console.error('Error fetching data from API:', error);
      });

  }



  const calculateScaleMobileLogos = () => {
    const width = window.innerWidth;
    if (width >= 640) {
      return setScaleMobileIcons(1);
    }
    setScaleMobileIcons(width/640);
  };

  const toggleMobileFilters = () => {
    setMobileOpen((prevMobileOpen) => !prevMobileOpen);
  };  

  // FUNCION buildFilters
  // FUNCION buildFilters  
  // LA DATA QUE RECIBE ES LA INFORMACION GENERAL DE LAS COMPANIAS TRAIDA DEL BACKEND
  const buildFilters = (data) => {
    
    //CREAR EL OBJETO FILTERS
    const filters = {};
    
    // AL OBJETO "filters" LE CREA LAS MISMAS KEYS QUE TIENE "filtersConfig". 
    // O SEA "keywords" "subcategories" "headequarterLocation" "activeIn"
    Object.keys(filtersConfig).forEach((filterKey) => {
      filters[filterKey] = [];
    });



    //CON UN forEach RECORRE LA DATA GENERAL TRAIDA DEL BACKEND. ES DECIR RECORRE CADA UNA DE LAS CATEGORIAS
    
    data?.forEach((category) => {
    
      //LUEGO EN CADA INSTANCIA DE LAS CATEGORIAS, RECORRE LA PROPIEDAD "logos" , QUE EQUIVALE AL LISTADO DE LAS COMPANIAS
      category.logos.forEach((logo) => {
        
        //AHORA RECORRE EL OBJETO "filters" --QUE HASTA EL MOMENTO SOLO TIENE LOS KEYS "keywords" "subcategories" "headequarterLocation" "activeIn" VACIOS --
        Object.keys(filters).forEach((filterKey) => {
          
          // Concatenate values for each filter type
          // EN CADA CADA ITERACION SOBRE LOS KEYS DE "filters", LLENA LA PROPIEDADES 
          //   QUIERE DECIR, QUE LUEGO DE TODO ESTE CUERPO "filters" VA A TENER TODAS SUS PROPIEDADES LLENAS CON LA INFORMACION 
          // DE CADA UNA DE LAS EMPRESAS  
          filters[filterKey] = filters[filterKey].concat(logo[filterKey]);
        });
      });
    });



    // Convert to unique and sorted arrays
    //RECORRE EL OBJETO "filters" UTILIZANDO CADA UNA DE SUS PROPIEDADES
    Object.keys(filters).forEach((filterKey) => {

      // EN ESTA VARIABLE "uniqueValues" VA A ALMACENAR TODO LO CONTENIDO EN EL ARRAY DE LA PROPIEDAD DEL OBJETO "filters" 
      // SOBRE LA QUE SE ESTA HACIENDO EL LOOP. CON ESAS BUILD-IN FUNCTIONS LO QUE SE ESTA BUSCANDO ES QUE ELIMINE LOS REPETIDOS
      // EN CADA UNA DE LOS ARRAYS PERTENECIENTES A LAS PROPIEDADES DEL OBJETO "filters" 
      const uniqueValues = [...new Set(filters[filterKey])].sort();

      setFiltersConfig(prevConfig => ({
        ...prevConfig,
        [filterKey]: {
          ...prevConfig[filterKey],
          allFilters: uniqueValues
        }

      }));
    });
  };

  const toggleSelectCategory = () => {

    // LAS SIGUIENTES 13 LINEAS SON PARA IDENTIFICAR SI YA HAY ALGUN FILTRO ELEGIDO 

    let hasSelectedFilters = false;

    // Iterate over the keys of the filtersConfig object
    for (const key in filtersConfig) {
      if (filtersConfig.hasOwnProperty(key)) {
        // Check if the selectedFilters array is not empty
        if (filtersConfig[key].selectedFilters.length > 0) {
          hasSelectedFilters = true;
          break; // Exit the loop as we found a non-empty selectedFilters array
        }
      }
    }
    
    if(!hasSelectedFilters){
      setSelectCategoryOpen((open) => !open);      
    }


  };

  const selectCategory = (key) => {
    if (selectCategoryOpen) {
      toggleSelectCategory();
    }
    setSelectedCategory((prevSelectedCategory) =>
      prevSelectedCategory === key ? '' : key
    );
  };

  // const clickedOnFilter = (key) =>{
    
  //   toggleSelectFilters(key)


  //   onClick={() => selectFilter('keywords', filtersConfig['keywords'].allFilters[key])}    
  // }

  const toggleSelectFilters = (filterKey) => {


    // LAS SIGUIENTES 13 LINEAS SON PARA IDENTIFICAR SI YA HAY ALGUN FILTRO ELEGIDO 

    let hasSelectedFilters = false;

    // Iterate over the keys of the filtersConfig object
    for (const key in filtersConfig) {
      if (filtersConfig.hasOwnProperty(key)) {
        // Check if the selectedFilters array is not empty
        if (filtersConfig[key].selectedFilters.length > 0) {
          hasSelectedFilters = true;
          break; // Exit the loop as we found a non-empty selectedFilters array
        }
      }
    }



    // SI NO HAY ALGUN FILTRO SELECCIONADO, NO ABRAS LOS LISTADOS
    if(!hasSelectedFilters && !selectedCategory) {
      setFiltersConfig((prevConfig) => ({
        ...prevConfig,
        [filterKey]: {
          ...prevConfig[filterKey],
          open: !prevConfig[filterKey].open
        }
      }));
    }


  };


  const selectFilter = (key, filter) => {
    

    toggleSelectFilters(key)
    

    if( key == 'keywords'){

      setFiltersConfig((prevConfig) => {
        const currentFilters = prevConfig[key];
        
        return {
          ...prevConfig,
          [key]: {
            ...currentFilters,
            selectedFilters: [...filter]
          }
        };        
      })
    
    }


    setFiltersConfig((prevConfig) => {
      
      //COGE EL filtersConfig PREVIO Y GUARDA LA DATA DE LA PROPIEDAD ESPECIFICA ENVIADA POR PARAM, EN currentFilters
      const currentFilters = prevConfig[key];
      
      if (currentFilters.selectedFilters.includes(filter)) {
        const updatedFilters = currentFilters.selectedFilters.filter((selectedFilter) => selectedFilter !== filter);
  
        return {
          ...prevConfig,
          [key]: {
            ...currentFilters,
            selectedFilters: updatedFilters
          }
        };
      }
  
      return {
        ...prevConfig,
        [key]: {
          ...currentFilters,
          selectedFilters: [...currentFilters.selectedFilters, filter]
        }
      };
    });
  };
  
  const clearFilters = (filterKey) => {
    setFiltersConfig((prevConfig) => ({
      ...prevConfig,
      [filterKey]: {
        ...prevConfig[filterKey],
        selectedFilters: []
      }
    }));
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setFiltersConfig((prevConfig) => {
      const updatedConfig = { ...prevConfig };
      Object.keys(updatedConfig).forEach((key) => {
        updatedConfig[key].selectedFilters = [];
      });
      return updatedConfig;
    });
  };


// !! ------- START REFACTOR DE RENDERCATEGORYLOGOS 
 
  const renderCategoryLogos = (category, logoCount) => {
    const findLogoUrl = (category, index) => {
      const publicId = `${category}-logo-${index}`;
      const logo = staticdata.find(logo => logo.public_id === publicId);
      return logo ? logo.url : 'default-image-url.png'; // Provide a default image URL if not found
    };

  let sumaID = {
      'category-1': 0,
      'category-2': 11,
      'category-3': 16,
      'category-4': 21,
      'category-5': 30,
      'category-6': 43,
      'category-7': 60,
      'category-8': 68,
      'category-9': 75,
      'category-10': 80,
      'category-11': 88,
      'category-12': 94,
      'category-13': 98,
      'category-14': 113,
    }  

    return (
      <div className={`category-static ${category}`}>
      {
        
        Array.from({ length: logoCount }).map((_, index) => {
        
          //IF COMO SOLUCION MOMENTANEA PARA QUITAR EL CLICKABLE DEL INTERFACED
          if( (1 + index + sumaID[category]) == 68){
            return (
              <div key={index}>
                  <div className="integrated-logo">
                    <img
                      src={findLogoUrl(category, index + 1)}
                      alt="Logo"
                      style={{cursor: "default"}}
                    />
                  </div>
              </div>
            )
          } else{

            return (    
                <div key={index}>
                  <a href={`https://treasurymap.vercel.app/companyPage/${ 1 + index + sumaID[category]}`} >
                    <div className="category-logo-wrapper">
                      <img
                        src={findLogoUrl(category, index + 1)}
                        alt="Logo"
                      />
                    </div>
                  </a>
                </div>
              )
          }



         })
      
      }
      </div>
    );
  };


// !! -------END REFACTOR DE RENDERCATEGORYLOGOS


// ? -----------OLD RENDERCATEGORYLOGOS --------------------
// ? -----------OLD RENDERCATEGORYLOGOS
    // ESTA FUNCION ES LLAMADA VARIAS VECES DE FORMA ESTATICA 
    // ESTA FUNCION renderCategoryLogos TOMA COMO PARAMETROS "CATEGORY" Y "LOGOCOUNT"
    // PARAMETRO "CATEGORY" ES ENVIADO DE FORMA ESTATICA DESDE EL HTML ESCRITO Y SE ENCARGA DE ESPECIFICAR EL CLASS DE EL DIV PARA 
    // SEGUN ESO DISTRIBUIR LOS LOGOS EN EL ESPACIO PORQUE 
    // EL PARAMETRO "logoCount" ES DEFINIDO MANUALMENTE, LITERALMENTE ES UN NUMERO ESCRITO. ESTE NUMERO UNICAMENTE SIRVE PARA 
    // QUE SEPA CUANTAS ITERACIONES TIENE QUE HACER EL MAP 
    // EL MAP GENERA UN INDEX EN CADA ITERACION Y ES ESE INDEX EL QUE COLOCA EN LA PLANTILLA DE TEXTO DENTRO DE LAS BACKTICKS

    //ESTO QUIERE DECIR QUE PARA QUE ESTE CODIGO FUNCIONE, TIENES QUE TENER CONTROLADO EL NOMBRE CON EL QUE ES ALMACENADO EL LOGO, 
    //DONDE SE MARCA EL NUMERO DE LA CATEGORIA Y EL NUMERO DE LOGO DENTRO DE ESA CATEGORIA

    // const renderCategoryLogos = (category, logoCount) => (
    
  //   //AQUI UTILIZA EL PRIMER PARAMETRO "category" para definir la claas del DIV padre, que habilitara los estilos de cada categoria del mapa estatico
  //   // ACTUALMENTE ES ENVIADO MANUALMENTE
    //   <div className={`category-static ${category}`}>

      
    //     {
    //     // REALIZARA UN LOOP, LA CANTIDAD DE VECES QUE VENGA INDICADO EN EL SEGUNDO PARAMETRO, "logoCount", QUE ACTUALMENTE ES ENVIADO MANUALMENTE
    //     Array.from({ length: logoCount }).map((_, index) => (
          
    //       <div key={index}>
    //         <a href="http://www.example.com" target="_blank">
    //           <div className="category-logo-wrapper">
    //             <img
    //               src={`assets/interactive-map/static-map-logos/${category}-logo-${index + 1}.png`}
    //               alt="Logo"
    //             />
    //           </div>
    //         </a>
    //       </div>
    //     ))}
    //   </div>
    // );
  



  //ENTENDER "filteredLogos"

  const filteredLogos = useMemo(() => {

   
    const selectedCategoryKey = selectedCategory;
    
    // GENERA UN NUEVO ARRAY QUE SOLO TIENE los "selectedFilters" del objeto "filtersConfig"
    // MODIFICAR EL CODIGO PARA QUE SOLO SE PUEDA UN FILTRO PERO OJO AQUI CON VER QUE PASA CUANDO MAS DE UN FILTRO 
    // AQUI VAMOS A BUSCAR QUE FILTRO ESTA ACTIVO Y QUE ELECCION SE HIZO EN ESE FILTRO
    
    let typeofFilter = ''
    
    const selectedFilters = Object.values(filtersConfig)
      .map((filterObj) => {
        // console.log('filter:');
        // console.log(filter);
        
        // IDENTIFICAR CUAL FUE EL TIPO DE FILTRO ELEGIDO
        if(filterObj.selectedFilters.length > 0){
          
          if(filterObj.title == "Keywords"){
            //console.log('selected filters mayor a 0');
            typeofFilter = "keywords"

          } else if( filterObj.title == "Sub-Category"){

            typeofFilter = "subcategories"

          } else if( filterObj.title == "Headquarter location"){
            
            typeofFilter = "headequarterLocation"
            
          } else if( filterObj.title == "Active in" ){

            typeofFilter = "activeIn"
            
          }

        }


        // DEVUELVE EL ARRAY CON EL FILTRO ELEGIDO
        return filterObj.selectedFilters

      })
      .flat();

    // console.log("selectedFilters");     
    // console.log(selectedFilters);     


    const noCategorySelected = !selectedCategoryKey;
 
    // SI NO HAY CATEGORIA SELECCIONADA, Y NO HAY FILTRO SELECCIONADO, NO RENDERIZA NADA
    if (noCategorySelected && selectedFilters.length === 0) {
      return [];
    }
  

    // ? EMPIEZA REFACTOR DEL ALGORITMO:
    // ? EMPIEZA REFACTOR DEL ALGORITMO:

    // AGREGAMOS TODAS LAS COMPANIES "logos" EN UN ARRAY
    const allUniqueLogos = mapData
      .map(item => item.logos) // Get all logos arrays
      .reduce((acc, logos) => acc.concat(logos), []) // Flatten the array of arrays
      .reduce((unique, logo) => {
        // Add logo to unique array if not already present
        if (!unique.some(item => item.image === logo.image && item.url === logo.url)) {
          unique.push(logo);
        }
        return unique;
      }, []);  

    // console.log("allUniqueLogos");      
    // console.log(allUniqueLogos);


    //RECORRE CADA UNA DE LAS COMPANIAS
    const logosFiltrados = allUniqueLogos.filter(logo => {
            


            
            //Logica cuando es un keyword
            if( typeofFilter == "keywords" ){

              function extractNumberFromURL(url) {
                  const parts = url.split('/');
                  return parts[parts.length - 1];
              }

              let idComp = extractNumberFromURL(logo.url)



              return selectedFilters.includes( Number(idComp) )

            } else if ( Array.isArray(logo[typeofFilter]) ) {
                
                // If it's an array, check if there's any overlap with selectedFilters

                
              return logo[typeofFilter].some(filter => {
                
                return selectedFilters.includes(filter)
              
              });
            
            } else {

                console.log("False");
                //console.log(logo[typeofFilter]);
                // If it's a string, check if it matches any of the selectedFilters
                return selectedFilters.includes(logo[typeofFilter]);
            }

        });  
        
    // console.log("logosFiltrados:");
    // console.log(logosFiltrados);


    // ? TERMINA REFACTOR DEL ALGORITMO:
    // ? TERMINA REFACTOR DEL ALGORITMO:


    // ! ESTA FUNCION FILTRA Y DEVUELVE LAS CATEGORIAS ITERANDO SOBRE EL "mapData"
    // ! AQUI INICIA filteredCategories
    const filteredCategories = mapData.filter((category) => {

      // Filter based on selected category    
      // ESTA VARIABLE VA A VALIDAR O CONVERTIRSE EN true SI
      // 1) NO HAY NINGUNA CATEGORIA SELECCIONADA
      // 2) LA CATEGORIA SELECCIONADA ES LA MISMA QUE LA "categoryKey"
      const matchesCategory = noCategorySelected || category.categoryKey === selectedCategoryKey;

      // Filter based on selected filters
      const matchesFilters =
        
        // EL SIGUIENTE "OR" EJECUTARA UN "true" SI ES QUE NO HAY NINGUN FILTRO ELEGIDO. 
        selectedFilters.length === 0 ||
        
        // SI HAY ALGUN FILTRO ELEGIDO, PROCEDERA A LA SIGUIENTE OPERACION 
        // ITERARA SOBRE LOS "logos" (QUE SON LAS COMPANIAS DE CADA CATEGORIA DEL ARRAY "mapData") EN BUSQUEDA DE QUE 
        // ALGUNO (.some) CUMPLA COMO true LA FUNCION PASADA EN EL CUERPO
        category.logos.some((logo) => {

          // CON selectedFilters.every() VA A RECORRER EL ARRAY "selectedFilters" E IDENTIFICAR SI TODOS SUS ELEMENTOS
          // CUMPLEN CON LAS C
          const secondLevelResult = selectedFilters.every((filter) => {            
            
            const thirdLevelResult = logo.keywords.includes(filter) ||
            logo.subcategories.includes(filter) ||
            logo.headequarterLocation.includes(filter) ||
            logo.activeIn.includes(filter)

            return thirdLevelResult
          
          })
         
          return secondLevelResult
        
        });
    
      return matchesCategory && matchesFilters;
    });

    // ! AQUI TERMINA filteredCategories
    // ! AQUI TERMINA filteredCategories
    

   
    // Extract logos from filtered categories
    const logos = filteredCategories.flatMap((category) => category.logos);

    if(!!selectedCategory){
      return logos;
    }else{
      return logosFiltrados
    }
    


  }, [selectedCategory, filtersConfig, mapData]);



  const frontMapOpen = useMemo(() => {
    return selectedCategory || filteredLogos.length;
  }, [selectedCategory, filteredLogos]);
  

  // USEEFFECT INICIALIZADOR DE FETCH DE INFORMACION 
  useEffect(() => {
    const startMap = async () => {
      const data = await fetchDataFromAPI();
      buildFilters(data);
      setTimeout(() => {
        setLoaded(true);
      }, 100);
    };

    startMap();

    //CARGAR LA LISTA DE SUBCATEGORIES
    fetchSubcategories();
    fetchActiveInData();
    fetchAllCompaniesData();



    window.addEventListener('resize', calculateScaleMobileLogos);

    return () => {
      window.removeEventListener('resize', calculateScaleMobileLogos);
    };
  }, []);

  useEffect(() => {
    if (filteredLogos.length && !resettingFrontLogos) {
      setResettingFrontLogos(true);
      setTimeout(() => {
        setResettingFrontLogos(false);
      }, 120);
    }
  }, [filteredLogos]);

  return (
    <div className="map-wrapper">
      <div id="interactive-map">
        <div className={`interactive-map-wrapper ${loaded ? 'loaded' : ''}`} style={{ backgroundImage: `url(${mapBackgroundImage})` }}>
          <div className={`interactive-map-inner ${frontMapOpen ? 'front-open' : ''}`}>
            <div className="map-title-wrapper">
              <img className="map-title" src={mapCenterTitle} alt="" />
            </div> 
            <div className="map-static-logos">
              <div className="dividers">
                {Array.from({ length: 15 }).map((_, index) => (
                  <div key={index}><span></span></div>
                ))}
              </div>

              {
              /*  "MANUALMENTE" COLOCA CADA UNA DE LAS CATEGORIAS PATA QUE EJECUTE LA FUNCION RENDERCATEGORYLOGOS*/
              // ! RENDERIZADO LOGOS ESTATICOS
              // ! RENDERIZADO LOGOS ESTATICOS
              // ! RENDERIZADO LOGOS ESTATICOS

              }

              {renderCategoryLogos('category-1', 11)}
              {renderCategoryLogos('category-2', 5)}
              {renderCategoryLogos('category-3', 5)}
              {renderCategoryLogos('category-4', 9)}
              {renderCategoryLogos('category-5', 13)}
              {renderCategoryLogos('category-6', 17)}
              {renderCategoryLogos('category-7', 8)}
              {renderCategoryLogos('category-8', 7)}
              {renderCategoryLogos('category-9', 5)}
              {renderCategoryLogos('category-10', 8)}
              {renderCategoryLogos('category-11', 6)}
              {renderCategoryLogos('category-12', 4)}
              {renderCategoryLogos('category-13', 15)}
              {renderCategoryLogos('category-14', 6)}
            </div>
            <div className={`front-category-logos ${resettingFrontLogos ? 'resetting' : ''}`}>
              {mapData.map((category, i) => (
                <div
                  key={category.id}
                  className={`category-title category-title-${category.id + 1} ${selectedCategory === `category-${i + 1}` ? 'selected' : ''}`}
                >
                  <div className="category-title-inner">
                    <div className="category-title-image">
                      <img src={category.categoryImage} onClick={() => selectCategory(`category-${i + 1}`)} />
                    </div>
                  </div>
                  <div className="mobile-back-icons">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index}>
                        {category.logos[index - 1]?.image && <img src={category.logos[index - 1]?.image} alt="Logo" />}
                      </div>
                    ))}
                  </div>
                  <div className="category-title-see-all" onClick={() => selectCategory(`category-${i + 1}`)}>
                    See all
                  </div>
                </div>
              ))}
              <div className={`category-logos ${frontMapOpen ? 'open' : ''}`} style={{ transform: `scale(${scaleMobileIcons})` }}>
                <div className={`category-logos-inner ${filteredLogos.length > 10 ? 'more-than-10' : ''}`}>
                  
                  
                  {

                  //EN ESTE BLOQUE SE RENDERIZAN LOS LOGOS SELECCIONADOS. 
                  
                  filteredLogos.map((logo, index) => (
                    <div key={index} className="category-logo">
                      <div className="category-logo-inner">
                        <a href={logo.url}>
                          <div style={{ backgroundImage: `url(${logo.image})` }}></div>
                        </a>
                      </div>
                    </div>
                  ))
                  
                  }

                </div>
              </div>
            </div>
            <div className={`menu-mobile ${mobileOpen ? 'open' : ''}`}>
              <h2>Filter by</h2>
              <div onClick={toggleMobileFilters}>{ mobileOpen ? 'X' : '+' }</div>
            </div>
          </div>
          <div className={`map-outline ${!!selectedCategory ? 'visible' : ''}`} onClick={selectCategory}></div>
        </div>
        <div className={`interactive-map-filter ${mobileOpen ? 'mobile-open' : ''}`}>
          <div className="interactive-map-filter-inner">





            <div className="category-filters-wrapper">
              {/* <p>{filtersConfig['keywords'].title}</p> */}
              

              {/*  EMPIEZA EL SEARCH BAR DE KEYWORDS   ------------------------------*/}

              <p>{`Keywords`}</p>
              
              {/* <div className="category-filters"> */}


                  {/* <div className={`filters-selection-list ${filtersConfig['keywords'].open ? 'open' : ''}`}> */}
                  
                  <div className={"div-search-input"}>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Enter keyword..."
                      className={'input-placeholder'}
                      style={{ flexGrow: 1, outline: "none" }}
                    />
                    <button 
                    onClick={handleSearch} 
                    style={{background: "none", color: 'inherit'}}
                    >O</button>
                  </div>



                  {/* PARA GENERAT LA ETIQUETA DEL KEYWOR ELEGIDO */}
                  <div className="current-filters-list">
                    <div className="current-filters-list-wrapper">
                    {
                    filtersConfig['keywords'].selectedFilters.length >= 2 && (
                      // <span onClick={() => clearFilters('keywords')}>Clear</span>

                      <div key={'keyword1'} className="current-filters-list-item" onClick={() => clearFilters('keywords')}>
                        {renderSearched} <span style={{display: 'inline', color:"black", fontSize: "larger" , fontWeight: "bold"}} >x</span>   
                      </div>                      


                    )
                    }                     

                    </div>

                  </div>


            </div>




            <div className="category-selection-wrapper">
              <p>Category</p>
              <div className="category-selection">
                <div className="category-selection-active" onClick={toggleSelectCategory}>
                  <span className="selected">{selectedCategory ? categories[selectedCategory] : null}</span>
                  <span>{!selectedCategory && 'Select category'}</span>
                </div>
                <div className={`category-selection-list ${selectCategoryOpen ? 'open' : ''}`}>
                  {Object.keys(categories).map((key) => (
                    <div
                      key={key}
                      className={selectedCategory === key ? 'selected' : ''}
                      onClick={() => selectCategory(key)}>
                      {categories[key]}
                    </div>
                  ))}
                </div>
              </div>
            </div>




            <div className="category-filters-wrapper">
              <p>{filtersConfig['subcategories'].title}</p>
              {/* <p>{`Sub-Category`}</p> */}

              <div className="category-filters">
                
                {/* ESTE CODIGO ES PARA ABRIR EL DRIPDOWN */}
                <span className="category-filters-placeholder" onClick={() => toggleSelectFilters('subcategories')}>
                  {filtersConfig['subcategories'].placeholder}
                </span>
                


                {/* ESTE CODIGO ES LA RENDERIZACION DEL DROPDOWN */}
                <div className={`filters-selection-list ${filtersConfig['subcategories'].open ? 'open' : ''}`}>
                    
                    {

                      // RENDERIZACION DEL DROPDOWN DE SUBCATEGORIES

                      subcategoriesData && Object.keys(filtersConfig['subcategories'].allFilters).map((key) => {
                              
                              //console.log(key);
                              const subcategoryId = filtersConfig['subcategories'].allFilters[key];
                              const subcategory = subcategoriesData.find(subcat => subcat.id === subcategoryId);
                              
                              return (
                                  <div
                                      key={key}
                                      onClick={() => selectFilter('subcategories', subcategoryId)}
                                      className={filtersConfig['subcategories'].selectedFilters.includes(subcategoryId) ? 'selected' : ''}>
                                      
                                      {/* Render the name of the subcategory */}
                                      
                                      {subcategory ? subcategory.name : 'Unknown Subcategory'}

                                  </div>
                              );
                          })
                    }                  
              
                </div>

              </div>




              <div className="current-filters-list">
                <div className="current-filters-list-wrapper">
                  {filtersConfig['subcategories'].selectedFilters.map((filter) => (
                    <div key={filter} className="current-filters-list-item" onClick={() => selectFilter('subcategories', filter)}>
                      {subcategoriesData.find(r => r.id === filter)?.name || filter} <span style={{display: 'inline', color:"black", fontSize: "larger" , fontWeight: "bold"}} >x</span>                       
                    </div>

                  ))}
                </div>
                {filtersConfig['subcategories'].selectedFilters.length >= 2 && (
                  <span onClick={() => clearFilters('subcategories')}>Clear</span>
                )}
              </div>
            </div>





            <div className="category-filters-wrapper">
              <p>{filtersConfig['headequarterLocation'].title}</p>
              {/* <p>{`Headquarter location`}</p>               */}
              <div className="category-filters">
                <span className="category-filters-placeholder" onClick={() => toggleSelectFilters('headequarterLocation')}>
                  {filtersConfig['headequarterLocation'].placeholder}
                </span>
                <div className={`filters-selection-list ${filtersConfig['headequarterLocation'].open ? 'open' : ''}`}>
                  
                  {

                  //RENDERIZACION DEL DROPDOWN DE HEADQUARTER

                  Object.keys(filtersConfig['headequarterLocation'].allFilters).map((key) => (
                    <div
                      key={key}
                      onClick={() => selectFilter('headequarterLocation', filtersConfig['headequarterLocation'].allFilters[key])}
                      className={filtersConfig['headequarterLocation'].selectedFilters.includes(filtersConfig['headequarterLocation'].allFilters[key]) ? 'selected' : ''}>
                      {filtersConfig['headequarterLocation'].allFilters[key]}
                    </div>
                  ))
                  
                  }
                </div>
              </div>
              

              
              <div className="current-filters-list">
                <div className="current-filters-list-wrapper">
                  {filtersConfig['headequarterLocation'].selectedFilters.map((filter) => (

                    <div key={filter} className="current-filters-list-item" onClick={() => selectFilter('headequarterLocation', filter)}>
                      {filter} <span style={{display: 'inline', color:"black", fontSize: "larger" , fontWeight: "bold"}} >x</span>   
                    </div>

                  ))}
                </div>
                {filtersConfig['headequarterLocation'].selectedFilters.length >= 2 && (
                  <span onClick={() => clearFilters('headequarterLocation')}>Clear</span>
                )}
              </div>



            </div>

            <div className="category-filters-wrapper">
              <p>{filtersConfig['activeIn'].title}</p>
              {/* <p>{`Active in`}</p>                    */}
              <div className="category-filters">
                <span className="category-filters-placeholder" onClick={() => toggleSelectFilters('activeIn')}>
                  {filtersConfig['activeIn'].placeholder}
                </span>
                <div className={`filters-selection-list ${filtersConfig['activeIn'].open ? 'open' : ''}`}>
                  
                    {

                      // RENDERIZACION DEL DROPDOWN DE SUBCATEGORIES

                      activeinData && Object.keys(filtersConfig['activeIn'].allFilters).map((key) => {
                              
                              //console.log(key);
                              const activeinId = filtersConfig['activeIn'].allFilters[key];
                              // console.log("key:");
                              // console.log(key);                                 
                              // console.log("filtersConfig['activeIn'].allFilters[key]:");
                              // console.log(filtersConfig['activeIn'].allFilters[key]);
                              // console.log("activeinId");
                              // console.log(activeinId);                              
                              const activein = activeinData.find(subcat => subcat.id === activeinId);
                              
                              return (
                                  <div
                                      key={key}
                                      onClick={() => selectFilter('activeIn', activeinId)}
                                      className={filtersConfig['activeIn'].selectedFilters.includes(activeinId) ? 'selected' : ''}>
                                      
                                      {/* Render the name of the subcategory */}
                                      
                                      {activein ? activein.name : 'Unknown Region'}

                                  </div>
                              );
                          })
                    }  


                  
                  
                  {
                    // Object.keys(filtersConfig['activeIn'].allFilters).map((key) => (
                    //   <div
                    //     key={key}
                    //     onClick={() => selectFilter('activeIn', filtersConfig['activeIn'].allFilters[key])}
                    //     className={filtersConfig['activeIn'].selectedFilters.includes(filtersConfig['activeIn'].allFilters[key]) ? 'selected' : ''}>
                    //     {filtersConfig['activeIn'].allFilters[key]}
                    //   </div>
                    // ))
                  }

                </div>
              </div>



              <div className="current-filters-list">
                <div className="current-filters-list-wrapper">
                  {filtersConfig['activeIn'].selectedFilters.map((filter) => (
                              
                    <div key={filter} className="current-filters-list-item" onClick={() => selectFilter('activeIn', filter)}>
                      {activeinData.find(r => r.id === filter)?.name || filter} <span style={{display: 'inline', color:"black", fontSize: "larger" , fontWeight: "bold"}} >x</span>
                    </div>

                  ))}
                </div>
                {filtersConfig['activeIn'].selectedFilters.length >= 2 && (
                  <span onClick={() => clearFilters('activeIn')}>Clear</span>
                )}
              </div>



            </div>
          </div>
          <div className="clear-filters-mobile">
            <div onClick={clearAllFilters}>Clear filters</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryMap;
