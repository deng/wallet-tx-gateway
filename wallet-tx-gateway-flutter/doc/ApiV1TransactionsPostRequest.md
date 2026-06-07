# wallet_tx_gateway.model.ApiV1TransactionsPostRequest

## Load the model package
```dart
import 'package:wallet_tx_gateway/api.dart';
```

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**address** | **String** | Wallet address | 
**chain** | **String** | CAIP-2 chain identifier | 
**skip** | **int** | Number of records to skip (default: 0) | [optional] 
**limit** | **int** | Max records to return (default: 20, max: 50) | [optional] 
**type** | **String** | Filter by transaction type (null/omit for all) | [optional] 
**contractAddress** | **String** | Filter by token contract address | [optional] 

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


