# Примечание
## Ошибки
Если такая ошибка от catch:  
```
Error: 
    no matching fragment 
       (operation="fragment", 
       info={...} code=UNSUPPORTED_OPERATION, 
       version=6.16.0)
```

есть вероятность что фабрика контрактов работает на основе старого api
### решение:
заново запустить ```npx hardhat compile``` и перенести заново файлы в папку api на фронте