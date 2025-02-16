"use client";
import React, { useState, useEffect, useMemo } from "react";
import { url } from "../../service/url.js";
import { apiGetMultiplayerMapData } from "@/app/service/apiGetMultiplayerMapData";
import styles from "./multiplayerMap.module.css";
import { MultiplayerMapCategories } from "./staticdata.jsx";

const TreasuryMap = () => {
  const mapCenterTitle =
    "https://res.cloudinary.com/dq7aof6vb/image/upload/v1739685416/MultiplayerMapBg_z1htg0.png";

  const mapBackgroundImage =
    "https://res.cloudinary.com/dq7aof6vb/image/upload/v1739563300/bgmultiplayer_bdasc3.png";

  const categories = {
    "category-1": "FIDP (Financial Instrument Dealing Platform)",
    "category-2": "FDF (Financial Data Feeding)",
    "category-3": "CMA (Currency Management Automation)",
    "category-4": "Integrators",
    "category-5": "OTS (Other Treasury Solutions)",
    "category-6": "TRMS (Treasury Risk Management System)",
    "category-7": "ERP (Enterprise Resource Planing)",
    "category-8": "Outsourcing",
    "category-9": "ETL (Extract Transform Load)",
    "category-10": "FSC (Financial Supply Chain)",
    "category-11": "CFF (Cash-Flow Forecasting)",
    "category-12": "eBAM (electronic Bank Account Management)",
    "category-13": "BSG (Bank Single gateway)",
    "category-14": "TR (Treasury Reporting)",
    "category-15": "PSP (Payment Service Provider)",
  };

  const [mapData, setMapData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectCategoryOpen, setSelectCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scaleMobileIcons, setScaleMobileIcons] = useState(1);
  const [dataByCategories, setDataByCategories] = useState();

  const [filtersConfig, setFiltersConfig] = useState({
    keywords: {
      open: false,
      title: "Keywords",
      placeholder: "Type keyword",
      allFilters: [],
      selectedFilters: [],
    },
    subcategories: {
      open: false,
      title: "Sub-Category",
      placeholder: "Select sub-category",
      allFilters: [],
      selectedFilters: [],
    },
    headequarterLocation: {
      open: false,
      title: "Headquarter location",
      placeholder: "Select headquarter location",
      allFilters: [],
      selectedFilters: [],
    },
    activeIn: {
      open: false,
      title: "Active in",
      placeholder: "Select active",
      allFilters: [],
      selectedFilters: [],
    },
  });

  const [resettingFrontLogos, setResettingFrontLogos] = useState(false);
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const [activeinData, setActiveinData] = useState([]);
  const [allCompData, setAllCompData] = useState([]);

  // ? LOGICA DE LA BARRA DE BUSQUEDA ----------------------

  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState([]);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [renderSearched, setRenderSearched] = useState("");

  const handleSearch = () => {
    if (searchTerm.length > 0) {
      const searchResult = allCompData
        .filter((item) =>
          item.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .map((item) => item.id);
      setResult(searchResult);
    }
  };

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
    } else {
      if (result.length > 0) {
        selectFilter("keywords", result);
        setRenderSearched(searchTerm);
        setSearchTerm("");
      } else {
        alert("No matches found");
      }
    }
  }, [result]);

  // ? LOGICA DE LA BARRA DE BUSQUEDA ----------------------

  // Your fetchDataFromAPI implementation
  const fetchDataFromAPI = async () => {
    const apiUrl = `${url}/api/v1/mapdata`;
    //const apiUrl = 'data.json';

    return fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMapData(data);
        //console.log(data);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      });
  };

  // Fetch the data for the subcategories list
  const fetchSubcategories = async () => {
    const subFetchDataURL = `${url}/api/v1/subCategories`;

    return fetch(subFetchDataURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSubcategoriesData(data);
        //console.log(data);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      });
  };
  // Fetch the data for the asctiveIn list
  const fetchActiveInData = async () => {
    const activeInFetchDataURL = `${url}/api/v1/countries`;

    return fetch(activeInFetchDataURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setActiveinData(data);
        //console.log(data);

        return data;
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      });
  };

  const fetchAllCompaniesData = async () => {
    const companiesDataURL = `${url}/api/v1/companies/`;

    return fetch(companiesDataURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAllCompData(data);
        //console.log(data);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching data from API:", error);
      });
  };

  const calculateScaleMobileLogos = () => {
    const width = window.innerWidth;
    if (width >= 640) {
      return setScaleMobileIcons(1);
    }
    setScaleMobileIcons(width / 640);
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

      setFiltersConfig((prevConfig) => ({
        ...prevConfig,
        [filterKey]: {
          ...prevConfig[filterKey],
          allFilters: uniqueValues,
        },
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

    if (!hasSelectedFilters) {
      setSelectCategoryOpen((open) => !open);
    }
  };

  const selectCategory = (key) => {
    if (selectCategoryOpen) {
      toggleSelectCategory();
    }
    setSelectedCategory((prevSelectedCategory) =>
      prevSelectedCategory === key ? "" : key
    );

    if (mobileOpen) {
      toggleMobileFilters();
    }
  };

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
    if (!hasSelectedFilters && !selectedCategory) {
      setFiltersConfig((prevConfig) => ({
        ...prevConfig,
        [filterKey]: {
          ...prevConfig[filterKey],
          open: !prevConfig[filterKey].open,
        },
      }));
    }
  };

  const selectFilter = (key, filter) => {
    toggleSelectFilters(key);

    // CUANDO UN EL FILTRO DE KEYWORD ES ACTIVADO, LAS LINEAS A CONTINUACIÓN CORREN.
    if (key == "keywords") {
      setFiltersConfig((prevConfig) => {
        const currentFilters = prevConfig[key];

        return {
          ...prevConfig,
          [key]: {
            ...currentFilters,
            selectedFilters: [...filter],
          },
        };
      });
    }

    setFiltersConfig((prevConfig) => {
      //COGE EL filtersConfig PREVIO Y GUARDA LA DATA DE LA PROPIEDAD ESPECIFICA ENVIADA POR PARAM, EN currentFilters
      const currentFilters = prevConfig[key];

      if (currentFilters.selectedFilters.includes(filter)) {
        const updatedFilters = currentFilters.selectedFilters.filter(
          (selectedFilter) => selectedFilter !== filter
        );

        return {
          ...prevConfig,
          [key]: {
            ...currentFilters,
            selectedFilters: updatedFilters,
          },
        };
      }

      return {
        ...prevConfig,
        [key]: {
          ...currentFilters,
          selectedFilters: [...currentFilters.selectedFilters, filter],
        },
      };
    });

    if (mobileOpen) {
      toggleMobileFilters();
    }
  };

  const clearFilters = (filterKey) => {
    setFiltersConfig((prevConfig) => ({
      ...prevConfig,
      [filterKey]: {
        ...prevConfig[filterKey],
        selectedFilters: [],
      },
    }));
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setFiltersConfig((prevConfig) => {
      const updatedConfig = { ...prevConfig };
      Object.keys(updatedConfig).forEach((key) => {
        updatedConfig[key].selectedFilters = [];
      });
      return updatedConfig;
    });
  };

  // ** ------- START REFACTOR 2 DE RENDERCATEGORYLOGOS -> WITH LIVE DATA

  const renderCategoryLogos = (category) => {
    return (
      <div className={`category-static ${category} ${styles[category]}`}>
        {dataByCategories?.[category]?.map((companyElement, index) => {
          if (companyElement.live) {
            return (
              <div key={index} id={`div-static-${companyElement.id}`}>
                <a href={`/companyPage/${companyElement.id}`}>
                  <div className="category-logo-wrapper">
                    <img
                      src={companyElement.logo}
                      id={`image-${companyElement.id}`}
                      alt="Logo"
                      className={`imagen`}
                    />
                  </div>
                </a>
              </div>
            );
          }
        })}
      </div>
    );
  };

  // ** ------- END REFACTOR 2 DE RENDERCATEGORYLOGOS -> WITH LIVE DATA

  const filteredLogos = useMemo(() => {
    const selectedCategoryKey = selectedCategory;

    // GENERA UN NUEVO ARRAY QUE SOLO TIENE los "selectedFilters" del objeto "filtersConfig"
    // MODIFICAR EL CODIGO PARA QUE SOLO SE PUEDA UN FILTRO PERO OJO AQUI CON VER QUE PASA CUANDO MAS DE UN FILTRO
    // AQUI VAMOS A BUSCAR QUE FILTRO ESTA ACTIVO Y QUE ELECCION SE HIZO EN ESE FILTRO

    let typeofFilter = "";

    const selectedFilters = Object.values(filtersConfig)
      .map((filterObj) => {
        // console.log('filter:');
        // console.log(filter);

        // IDENTIFICAR CUAL FUE EL TIPO DE FILTRO ELEGIDO
        if (filterObj.selectedFilters.length > 0) {
          if (filterObj.title == "Keywords") {
            //console.log('selected filters mayor a 0');
            typeofFilter = "keywords";
          } else if (filterObj.title == "Sub-Category") {
            typeofFilter = "subcategories";
          } else if (filterObj.title == "Headquarter location") {
            typeofFilter = "headequarterLocation";
          } else if (filterObj.title == "Active in") {
            typeofFilter = "activeIn";
          }
        }

        // DEVUELVE EL ARRAY CON EL FILTRO ELEGIDO
        return filterObj.selectedFilters;
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
      .map((item) => item.logos) // Get all logos arrays
      .reduce((acc, logos) => acc.concat(logos), []) // Flatten the array of arrays
      .reduce((unique, logo) => {
        // Add logo to unique array if not already present
        if (
          !unique.some(
            (item) => item.image === logo.image && item.url === logo.url
          )
        ) {
          unique.push(logo);
        }
        return unique;
      }, []);

    // console.log("allUniqueLogos");
    // console.log(allUniqueLogos);

    //RECORRE CADA UNA DE LAS COMPANIAS
    const logosFiltrados = allUniqueLogos.filter((logo) => {
      //Logica cuando es un keyword
      if (typeofFilter == "keywords") {
        function extractNumberFromURL(url) {
          const parts = url.split("/");
          return parts[parts.length - 1];
        }

        let idComp = extractNumberFromURL(logo.url);

        return selectedFilters.includes(Number(idComp));
      } else if (Array.isArray(logo[typeofFilter])) {
        // If it's an array, check if there's any overlap with selectedFilters

        return logo[typeofFilter].some((filter) => {
          return selectedFilters.includes(filter);
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
      const matchesCategory =
        noCategorySelected || category.categoryKey === selectedCategoryKey;

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
            const thirdLevelResult =
              logo.keywords.includes(filter) ||
              logo.subcategories.includes(filter) ||
              logo.headequarterLocation.includes(filter) ||
              logo.activeIn.includes(filter);

            return thirdLevelResult;
          });

          return secondLevelResult;
        });

      return matchesCategory && matchesFilters;
    });

    // ! AQUI TERMINA filteredCategories
    // ! AQUI TERMINA filteredCategories

    // Extract logos from filtered categories
    const logos = filteredCategories.flatMap((category) => category.logos);

    if (!!selectedCategory) {
      return logos;
    } else {
      return logosFiltrados;
    }
  }, [selectedCategory, filtersConfig, mapData]);

  const frontMapOpen = useMemo(() => {
    return selectedCategory || filteredLogos.length;
  }, [selectedCategory, filteredLogos]);

  const GetMultiplayerMapData = async () => {
    const MultiplayerMapData = await apiGetMultiplayerMapData();
    setDataByCategories(MultiplayerMapData);
  };

  // USEEFFECT INICIALIZADOR DE FETCH DE INFORMACION
  useEffect(() => {
    GetMultiplayerMapData();
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

    window.addEventListener("resize", calculateScaleMobileLogos);

    return () => {
      window.removeEventListener("resize", calculateScaleMobileLogos);
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
      <div
        id="interactive-map"
        style={{ backgroundImage: `url(${mapBackgroundImage})` }}
      >
        <div
          className={`interactive-map-filter ${
            mobileOpen ? "mobile-open" : ""
          }`}
        >
          <div className="interactive-map-filter-inner">
            <div className="category-filters-wrapper">
              {/* <p>{filtersConfig['keywords'].title}</p> */}

              {/*  EMPIEZA EL SEARCH BAR DE KEYWORDS   ------------------------------*/}

              <p className={"text-style-titles"}>{`Keywords`}</p>

              {/* <div className="category-filters"> */}

              {/* <div className={`filters-selection-list ${filtersConfig['keywords'].open ? 'open' : ''}`}> */}

              <div className={"div-search-input"}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter keyword..."
                  className={"input-placeholder"}
                  style={{ flexGrow: 1, outline: "none" }}
                />
                <button onClick={handleSearch} className={"search-button"}>
                  {/* <!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16"
                    width="16"
                    viewBox="0 0 512 512"
                  >
                    <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6 .1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                  </svg>
                </button>
              </div>

              {/* PARA GENERAT LA ETIQUETA DEL KEYWOR ELEGIDO */}
              <div className="current-filters-list">
                <div className="current-filters-list-wrapper">
                  {filtersConfig["keywords"].selectedFilters.length >= 2 && (
                    // <span onClick={() => clearFilters('keywords')}>Clear</span>

                    <div
                      key={"keyword1"}
                      className="current-filters-list-item"
                      onClick={() => clearFilters("keywords")}
                    >
                      {renderSearched}{" "}
                      <span
                        style={{
                          display: "inline",
                          color: "black",
                          fontSize: "larger",
                          fontWeight: "bold",
                        }}
                      >
                        x
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="category-selection-wrapper">
              <p className={"text-style-titles"}>Category</p>
              <div className="category-selection">
                <div
                  className="category-selection-active"
                  onClick={toggleSelectCategory}
                >
                  <span className="selected">
                    {selectedCategory ? categories[selectedCategory] : null}
                  </span>
                  <span style={{ fontSize: "small" }}>
                    {!selectedCategory && "Select category"}
                  </span>
                </div>

                <div
                  className={`category-selection-list ${
                    selectCategoryOpen ? "open" : ""
                  }`}
                >
                  {Object.entries(categories) // Convert object to array of key-value pairs
                    .sort((a, b) => a[1].localeCompare(b[1])) // Sort the array alphabetically by value
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className={selectedCategory === key ? "selected" : ""}
                        onClick={() => selectCategory(key)}
                      >
                        {value}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="category-filters-wrapper">
              <p className={"text-style-titles"}>
                {filtersConfig["subcategories"].title}
              </p>
              {/* <p className={"text-style-titles"}>{`Sub-Category`}</p> */}

              <div className="category-filters">
                {/* ESTE CODIGO ES PARA ABRIR EL DRIPDOWN */}
                <span
                  className="category-filters-placeholder"
                  onClick={() => toggleSelectFilters("subcategories")}
                >
                  {filtersConfig["subcategories"].placeholder}
                </span>

                <div
                  className={`filters-selection-list ${
                    filtersConfig["subcategories"].open ? "open" : ""
                  }`}
                >
                  {
                    // RENDERIZACION DEL DROPDOWN DE SUBCATEGORIES
                    subcategoriesData &&
                      Object.keys(filtersConfig["subcategories"].allFilters)
                        .map((key) => {
                          // Get the subcategory ID from the filtersConfig
                          const subcategoryId =
                            filtersConfig["subcategories"].allFilters[key];
                          // Find the corresponding subcategory in the subcategoriesData
                          return subcategoriesData.find(
                            (subcat) => subcat.id === subcategoryId
                          );
                        })
                        .filter((subcategory) => subcategory) // Filter out any undefined subcategories
                        .sort((a, b) => a.name.localeCompare(b.name)) // Sort the subcategories alphabetically
                        .map((subcategory) => (
                          <div
                            key={subcategory.id}
                            onClick={() =>
                              selectFilter("subcategories", subcategory.id)
                            }
                            className={
                              filtersConfig[
                                "subcategories"
                              ].selectedFilters.includes(subcategory.id)
                                ? "selected"
                                : ""
                            }
                          >
                            {/* Render the name of the subcategory */}
                            {subcategory.name}
                          </div>
                        ))
                  }
                </div>
              </div>

              <div className="current-filters-list">
                <div className="current-filters-list-wrapper">
                  {filtersConfig["subcategories"].selectedFilters.map(
                    (filter) => (
                      <div
                        key={filter}
                        className="current-filters-list-item"
                        onClick={() => selectFilter("subcategories", filter)}
                      >
                        {subcategoriesData.find((r) => r.id === filter)?.name ||
                          filter}{" "}
                        <span
                          style={{
                            display: "inline",
                            color: "black",
                            fontSize: "larger",
                            fontWeight: "bold",
                          }}
                        >
                          x
                        </span>
                      </div>
                    )
                  )}
                </div>
                {filtersConfig["subcategories"].selectedFilters.length >= 2 && (
                  <span onClick={() => clearFilters("subcategories")}>
                    Clear
                  </span>
                )}
              </div>
            </div>

            <div className="category-filters-wrapper">
              <p className={"text-style-titles"}>
                {filtersConfig["headequarterLocation"].title}
              </p>
              {/* <p className={"text-style-titles"}>{`Headquarter location`}</p>               */}
              <div className="category-filters">
                <span
                  className="category-filters-placeholder"
                  onClick={() => toggleSelectFilters("headequarterLocation")}
                >
                  {filtersConfig["headequarterLocation"].placeholder}
                </span>
                <div
                  className={`filters-selection-list ${
                    filtersConfig["headequarterLocation"].open ? "open" : ""
                  }`}
                >
                  {
                    //RENDERIZACION DEL DROPDOWN DE HEADQUARTER

                    Object.keys(
                      filtersConfig["headequarterLocation"].allFilters
                    ).map((key) => (
                      <div
                        key={key}
                        onClick={() =>
                          selectFilter(
                            "headequarterLocation",
                            filtersConfig["headequarterLocation"].allFilters[
                              key
                            ]
                          )
                        }
                        className={
                          filtersConfig[
                            "headequarterLocation"
                          ].selectedFilters.includes(
                            filtersConfig["headequarterLocation"].allFilters[
                              key
                            ]
                          )
                            ? "selected"
                            : ""
                        }
                      >
                        {filtersConfig["headequarterLocation"].allFilters[key]}
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="current-filters-list">
                <div className="current-filters-list-wrapper">
                  {filtersConfig["headequarterLocation"].selectedFilters.map(
                    (filter) => (
                      <div
                        key={filter}
                        className="current-filters-list-item"
                        onClick={() =>
                          selectFilter("headequarterLocation", filter)
                        }
                      >
                        {filter}{" "}
                        <span
                          style={{
                            display: "inline",
                            color: "black",
                            fontSize: "larger",
                            fontWeight: "bold",
                          }}
                        >
                          x
                        </span>
                      </div>
                    )
                  )}
                </div>
                {filtersConfig["headequarterLocation"].selectedFilters.length >=
                  2 && (
                  <span onClick={() => clearFilters("headequarterLocation")}>
                    Clear
                  </span>
                )}
              </div>
            </div>

            <div className="category-filters-wrapper">
              <p className={"text-style-titles"}>
                {filtersConfig["activeIn"].title}
              </p>
              {/* <p className={"text-style-titles"}>{`Active in`}</p>                    */}
              <div className="category-filters">
                <span
                  className="category-filters-placeholder"
                  onClick={() => toggleSelectFilters("activeIn")}
                >
                  {filtersConfig["activeIn"].placeholder}
                </span>
                <div
                  className={`filters-selection-list ${
                    filtersConfig["activeIn"].open ? "open" : ""
                  }`}
                >
                  {
                    // Check if activeinData exists and then sort and map it
                    activeinData &&
                      [...activeinData] // Create a shallow copy to avoid mutating the original array
                        .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name
                        .map((activein) => {
                          // Find the key corresponding to the activein's id in allFilters
                          const key = Object.keys(
                            filtersConfig["activeIn"].allFilters
                          ).find(
                            (key) =>
                              filtersConfig["activeIn"].allFilters[key] ===
                              activein.id
                          );

                          // Render the div for each activein
                          if (key) {
                            return (
                              <div
                                key={key}
                                onClick={() =>
                                  selectFilter("activeIn", activein.id)
                                }
                                className={
                                  filtersConfig[
                                    "activeIn"
                                  ].selectedFilters.includes(activein.id)
                                    ? "selected"
                                    : ""
                                }
                              >
                                {activein.name}
                              </div>
                            );
                          } else {
                            return null;
                          }
                        })
                  }
                </div>
              </div>

              <div className="current-filters-list">
                <div className="current-filters-list-wrapper">
                  {filtersConfig["activeIn"].selectedFilters.map((filter) => (
                    <div
                      key={filter}
                      className="current-filters-list-item"
                      onClick={() => selectFilter("activeIn", filter)}
                    >
                      {activeinData.find((r) => r.id === filter)?.name ||
                        filter}{" "}
                      <span
                        style={{
                          display: "inline",
                          color: "black",
                          fontSize: "larger",
                          fontWeight: "bold",
                        }}
                      >
                        x
                      </span>
                    </div>
                  ))}
                </div>
                {filtersConfig["activeIn"].selectedFilters.length >= 2 && (
                  <span onClick={() => clearFilters("activeIn")}>Clear</span>
                )}
              </div>
            </div>
          </div>
          <div className="clear-filters-mobile">
            <div onClick={clearAllFilters}>Clear filters</div>
          </div>
        </div>

        <div className={`interactive-map-wrapper ${loaded ? "loaded" : ""}`}>
          {/*
      ASI ESTABA ANTES DEL NEW MAP 
      <div id="interactive-map">
        <div className={`interactive-map-wrapper ${loaded ? 'loaded' : ''}`} style={{ backgroundImage: `url(${mapBackgroundImage})` }}> 
        */}

          <div
            className={`interactive-map-inner ${
              frontMapOpen ? "front-open" : ""
            }`}
          >
            {/* LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO -- LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO -- LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO */}
            {/* LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO -- LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO -- LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO */}
            {/* LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO -- LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO -- LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO */}

            {/* <div style={{transform: "translate(267px, -294px) scale(0.52)"}}>
              <img className='hardcodeLogo' src={`https://res.cloudinary.com/dq7aof6vb/image/upload/v1715385412/Frame_19_1_zxd0hz.png`} alt=""  />
            </div> */}

            {/* LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO -- LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO -- LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO */}
            {/* LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO -- LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO -- LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO */}
            {/* LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO -- LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO -- LINEA DE CODIGO DEL LOGO DE CAT 15 HARDCODEADO */}

            <div className="map-title-wrapper">
              <img className="map-title" src={mapCenterTitle} alt="" />
            </div>
            <div className="map-static-logos">
              <div className={`${styles.dividers} dividers`}>
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index}>
                    <span></span>
                  </div>
                ))}
              </div>
              <div className="interfacedLogo">
                <div>
                  <img
                    src={
                      "https://res.cloudinary.com/dq7aof6vb/image/upload/v1704650633/category-7-logo-8_kpxhtq.png"
                    }
                    alt=""
                  />
                </div>
              </div>

              {
                /*  "MANUALMENTE" COLOCA CADA UNA DE LAS CATEGORIAS PATA QUE EJECUTE LA FUNCION RENDERCATEGORYLOGOS*/
                // ! RENDERIZADO LOGOS ESTATICOS
                // ! RENDERIZADO LOGOS ESTATICOS
                // ! RENDERIZADO LOGOS ESTATICOS
              }

              {renderCategoryLogos("category-1")}
              {renderCategoryLogos("category-2")}
              {renderCategoryLogos("category-3")}
              {renderCategoryLogos("category-4")}
              {renderCategoryLogos("category-5")}
              {renderCategoryLogos("category-6")}
              {renderCategoryLogos("category-7")}
              {renderCategoryLogos("category-8")}
              {renderCategoryLogos("category-9")}
              {renderCategoryLogos("category-10")}
              {renderCategoryLogos("category-11")}
              {renderCategoryLogos("category-12")}
              {renderCategoryLogos("category-13")}
              {renderCategoryLogos("category-14")}
              {renderCategoryLogos("category-15")}
            </div>
            <div
              className={`front-category-logos ${
                resettingFrontLogos ? "resetting" : ""
              }`}
            >
              {/* // ! Renderizado de las imagenes de las categorias (TR, eBAM, BSG...) */}

              {MultiplayerMapCategories?.map((category, i) => (
                <div
                  key={category.id}
                  className={`category-title ${
                    styles.categoryTitle
                  } category-title-${category.id + 1} ${
                    selectedCategory === `category-${i + 1}` ? "selected" : ""
                  } ${styles[`category-img-position-${category.id + 1}`]}`}
                >
                  <div className="category-title-inner">
                    <div className="category-title-image">
                      <img
                        className={styles.categoryImage}
                        src={category.categoryImage}
                        onClick={() =>
                          selectCategory(`category-${category.id + 1}`)
                        }
                      />
                    </div>
                  </div>
                  <div className="mobile-back-icons">
                    {/* // ! Renderizado de las companies en mobile (Necto, PayPal, Visa...) */}
                    {
                      dataByCategories?.[category.categoryKey]?.reduce(
                        (acc, item, i) => {
                          if (acc.count >= 6) return acc; // Stop after rendering 6 elements

                          if (item?.live) {
                            acc.count++; // Increment the count
                            acc.elements.push(
                              <div key={i}>
                                <img src={item.logo} id={item.id} alt="logo" />
                              </div>
                            );
                          }

                          return acc;
                        },
                        { count: 0, elements: [] }
                      ).elements
                    }
                  </div>
                  <div
                    className="category-title-see-all"
                    onClick={() => selectCategory(`category-${i + 1}`)}
                  >
                    See all
                  </div>
                </div>
              ))}

              <div
                className={`category-logos ${frontMapOpen ? "open" : ""}`}
                style={{ transform: `scale(${scaleMobileIcons})` }}
              >
                <div
                  className={`category-logos-inner ${
                    filteredLogos.length > 10 ? "more-than-10" : ""
                  }`}
                >
                  {
                    // AQUI VA EL NUEVO BLOQUE DE CODIGO QUE FILTRA LOS LOGOS DEL MAPA FRONTAL QUE YA FILTA LOS LOGOS CORRECTAMENTE
                  }

                  {dataByCategories?.[selectedCategory]?.map(
                    (companyElement, index) => {
                      console.log("selectedCategory ", selectedCategory);

                      if (companyElement.live) {
                        return (
                          <div key={index} className="category-logo">
                            <div className="category-logo-inner">
                              <a href={`/companyPage/${companyElement.id}`}>
                                <div
                                  style={{
                                    backgroundImage: `url(${companyElement.logo})`,
                                  }}
                                ></div>
                              </a>
                            </div>
                          </div>
                        );
                      }
                    }
                  )}
                  {frontMapOpen > 0 &&
                    filteredLogos.map((company, index) => {
                      if (company.live) {
                        return (
                          <div key={index} className="category-logo">
                            <div className="category-logo-inner">
                              <a href={company.url}>
                                <div
                                  style={{
                                    backgroundImage: `url(${company.image})`,
                                  }}
                                ></div>
                              </a>
                            </div>
                          </div>
                        );
                      }
                    })}
                </div>
              </div>
            </div>
            <div className={`menu-mobile ${mobileOpen ? "open" : ""}`}>
              <h2 className="mobile-header">Filter by</h2>
              {mobileOpen && (
                <span className="button-clear-filter" onClick={clearAllFilters}>
                  Clear all filters
                </span>
              )}
              <div onClick={toggleMobileFilters}>{mobileOpen ? "X" : "+"}</div>
            </div>
          </div>
          <div
            className={`map-outline ${!!selectedCategory ? "visible" : ""}`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryMap;
