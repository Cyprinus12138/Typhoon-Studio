# Typhoon Studio

## Abstract

Coastal areas are often important areas and even strategic centers for population agglomeration, national economy and social development. And are also frequent areas of typhoon disasters. Therefore, predicting the intensity of a typhoon can help mankind formulate coping strategies to reduce personal and property losses. Although it is not realistic to accurately predict and prevent the occurrence of typhoons, satellite observations, data modeling and algorithm analysis can be used to improve the accuracy of typhoon determination and effectively forecast typhoon wind speed. FY-4 meteorological satellite of our country can provide continuous and real-time remote sensing images of the global atmosphere. But it cannot directly locate typhoons and directly estimate wind speed. The existing tropical cyclone intensity determination (estimation of the maximum central wind speed) algorithm is mainly developed for the meteorological satellite data of the United States, Japan and other places, and it cannot applied to the FY-4 satellite data effectively. In order to solve the above problems, we develop a typhoon data collection and intelligent analysis system based on the FY-4 meteorological satellite data and deep learning methods. The main contents of our research are as follows:
(1) Online real-time collection of the FF-4 satellite cloud image provided by the National Satellite Meteorological Center(NSMC) and the typhoon message issued by the China Meteorological Administration, and use the geographic coordinate transformation algorithm to locate and crop the typhoon image. A role-based access control mechanism is also designed and implemented to protect the intellectual property rights of the collected data. By improving the RBAC2 model, privileged objects are added to achieve more flexible access control.
(2) Realize the semi-supervised tensor regression network with regular terms to obtain high-precision typhoon intensity determination results, and integrate the model into the typhoon data collection and intelligent analysis system to realize the dynamic call of the model and the visualization of the estimation of the typhoon wind speed. 
This system is mainly developed using Python language and Node.js, and the database system uses MySQL and MongoDB. Tests prove that the system has successfully realized wind speed estimation based on typhoon satellite cloud image data, and the system is convenient and safe to use, and has high practical significance


This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).
