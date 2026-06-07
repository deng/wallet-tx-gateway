//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class TransactionItem {
  /// Returns a new [TransactionItem] instance.
  TransactionItem({
    this.txHash,
    this.type,
    this.from,
    this.to,
    this.value,
    this.symbol,
    this.decimals,
    this.contractAddress,
    this.timestamp,
    this.status,
    this.gasFee,
    this.methodId,
    this.blockNumber,
    this.tokenTransfers = const [],
  });

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? txHash;

  TransactionItemTypeEnum? type;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? from;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? to;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? value;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? symbol;

  int? decimals;

  String? contractAddress;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? timestamp;

  TransactionItemStatusEnum? status;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? gasFee;

  String? methodId;

  int? blockNumber;

  List<TokenTransfer> tokenTransfers;

  @override
  bool operator ==(Object other) => identical(this, other) || other is TransactionItem &&
    other.txHash == txHash &&
    other.type == type &&
    other.from == from &&
    other.to == to &&
    other.value == value &&
    other.symbol == symbol &&
    other.decimals == decimals &&
    other.contractAddress == contractAddress &&
    other.timestamp == timestamp &&
    other.status == status &&
    other.gasFee == gasFee &&
    other.methodId == methodId &&
    other.blockNumber == blockNumber &&
    _deepEquality.equals(other.tokenTransfers, tokenTransfers);

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (txHash == null ? 0 : txHash!.hashCode) +
    (type == null ? 0 : type!.hashCode) +
    (from == null ? 0 : from!.hashCode) +
    (to == null ? 0 : to!.hashCode) +
    (value == null ? 0 : value!.hashCode) +
    (symbol == null ? 0 : symbol!.hashCode) +
    (decimals == null ? 0 : decimals!.hashCode) +
    (contractAddress == null ? 0 : contractAddress!.hashCode) +
    (timestamp == null ? 0 : timestamp!.hashCode) +
    (status == null ? 0 : status!.hashCode) +
    (gasFee == null ? 0 : gasFee!.hashCode) +
    (methodId == null ? 0 : methodId!.hashCode) +
    (blockNumber == null ? 0 : blockNumber!.hashCode) +
    (tokenTransfers.hashCode);

  @override
  String toString() => 'TransactionItem[txHash=$txHash, type=$type, from=$from, to=$to, value=$value, symbol=$symbol, decimals=$decimals, contractAddress=$contractAddress, timestamp=$timestamp, status=$status, gasFee=$gasFee, methodId=$methodId, blockNumber=$blockNumber, tokenTransfers=$tokenTransfers]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.txHash != null) {
      json[r'txHash'] = this.txHash;
    } else {
      json[r'txHash'] = null;
    }
    if (this.type != null) {
      json[r'type'] = this.type;
    } else {
      json[r'type'] = null;
    }
    if (this.from != null) {
      json[r'from'] = this.from;
    } else {
      json[r'from'] = null;
    }
    if (this.to != null) {
      json[r'to'] = this.to;
    } else {
      json[r'to'] = null;
    }
    if (this.value != null) {
      json[r'value'] = this.value;
    } else {
      json[r'value'] = null;
    }
    if (this.symbol != null) {
      json[r'symbol'] = this.symbol;
    } else {
      json[r'symbol'] = null;
    }
    if (this.decimals != null) {
      json[r'decimals'] = this.decimals;
    } else {
      json[r'decimals'] = null;
    }
    if (this.contractAddress != null) {
      json[r'contractAddress'] = this.contractAddress;
    } else {
      json[r'contractAddress'] = null;
    }
    if (this.timestamp != null) {
      json[r'timestamp'] = this.timestamp;
    } else {
      json[r'timestamp'] = null;
    }
    if (this.status != null) {
      json[r'status'] = this.status;
    } else {
      json[r'status'] = null;
    }
    if (this.gasFee != null) {
      json[r'gasFee'] = this.gasFee;
    } else {
      json[r'gasFee'] = null;
    }
    if (this.methodId != null) {
      json[r'methodId'] = this.methodId;
    } else {
      json[r'methodId'] = null;
    }
    if (this.blockNumber != null) {
      json[r'blockNumber'] = this.blockNumber;
    } else {
      json[r'blockNumber'] = null;
    }
      json[r'tokenTransfers'] = this.tokenTransfers;
    return json;
  }

  /// Returns a new [TransactionItem] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TransactionItem? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "TransactionItem[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "TransactionItem[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return TransactionItem(
        txHash: mapValueOfType<String>(json, r'txHash'),
        type: TransactionItemTypeEnum.fromJson(json[r'type']),
        from: mapValueOfType<String>(json, r'from'),
        to: mapValueOfType<String>(json, r'to'),
        value: mapValueOfType<String>(json, r'value'),
        symbol: mapValueOfType<String>(json, r'symbol'),
        decimals: mapValueOfType<int>(json, r'decimals'),
        contractAddress: mapValueOfType<String>(json, r'contractAddress'),
        timestamp: mapValueOfType<int>(json, r'timestamp'),
        status: TransactionItemStatusEnum.fromJson(json[r'status']),
        gasFee: mapValueOfType<String>(json, r'gasFee'),
        methodId: mapValueOfType<String>(json, r'methodId'),
        blockNumber: mapValueOfType<int>(json, r'blockNumber'),
        tokenTransfers: TokenTransfer.listFromJson(json[r'tokenTransfers']),
      );
    }
    return null;
  }

  static List<TransactionItem> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TransactionItem>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TransactionItem.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TransactionItem> mapFromJson(dynamic json) {
    final map = <String, TransactionItem>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TransactionItem.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TransactionItem-objects as value to a dart map
  static Map<String, List<TransactionItem>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<TransactionItem>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TransactionItem.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}


class TransactionItemTypeEnum {
  /// Instantiate a new enum with the provided [value].
  const TransactionItemTypeEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const coin = TransactionItemTypeEnum._(r'coin');
  static const token = TransactionItemTypeEnum._(r'token');

  /// List of all possible values in this [enum][TransactionItemTypeEnum].
  static const values = <TransactionItemTypeEnum>[
    coin,
    token,
  ];

  static TransactionItemTypeEnum? fromJson(dynamic value) => TransactionItemTypeEnumTypeTransformer().decode(value);

  static List<TransactionItemTypeEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TransactionItemTypeEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TransactionItemTypeEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [TransactionItemTypeEnum] to String,
/// and [decode] dynamic data back to [TransactionItemTypeEnum].
class TransactionItemTypeEnumTypeTransformer {
  factory TransactionItemTypeEnumTypeTransformer() => _instance ??= const TransactionItemTypeEnumTypeTransformer._();

  const TransactionItemTypeEnumTypeTransformer._();

  String encode(TransactionItemTypeEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a TransactionItemTypeEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  TransactionItemTypeEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'coin': return TransactionItemTypeEnum.coin;
        case r'token': return TransactionItemTypeEnum.token;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [TransactionItemTypeEnumTypeTransformer] instance.
  static TransactionItemTypeEnumTypeTransformer? _instance;
}



class TransactionItemStatusEnum {
  /// Instantiate a new enum with the provided [value].
  const TransactionItemStatusEnum._(this.value);

  /// The underlying value of this enum member.
  final String value;

  @override
  String toString() => value;

  String toJson() => value;

  static const success = TransactionItemStatusEnum._(r'success');
  static const failed = TransactionItemStatusEnum._(r'failed');
  static const pending = TransactionItemStatusEnum._(r'pending');

  /// List of all possible values in this [enum][TransactionItemStatusEnum].
  static const values = <TransactionItemStatusEnum>[
    success,
    failed,
    pending,
  ];

  static TransactionItemStatusEnum? fromJson(dynamic value) => TransactionItemStatusEnumTypeTransformer().decode(value);

  static List<TransactionItemStatusEnum> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TransactionItemStatusEnum>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TransactionItemStatusEnum.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }
}

/// Transformation class that can [encode] an instance of [TransactionItemStatusEnum] to String,
/// and [decode] dynamic data back to [TransactionItemStatusEnum].
class TransactionItemStatusEnumTypeTransformer {
  factory TransactionItemStatusEnumTypeTransformer() => _instance ??= const TransactionItemStatusEnumTypeTransformer._();

  const TransactionItemStatusEnumTypeTransformer._();

  String encode(TransactionItemStatusEnum data) => data.value;

  /// Decodes a [dynamic value][data] to a TransactionItemStatusEnum.
  ///
  /// If [allowNull] is true and the [dynamic value][data] cannot be decoded successfully,
  /// then null is returned. However, if [allowNull] is false and the [dynamic value][data]
  /// cannot be decoded successfully, then an [UnimplementedError] is thrown.
  ///
  /// The [allowNull] is very handy when an API changes and a new enum value is added or removed,
  /// and users are still using an old app with the old code.
  TransactionItemStatusEnum? decode(dynamic data, {bool allowNull = true}) {
    if (data != null) {
      switch (data) {
        case r'success': return TransactionItemStatusEnum.success;
        case r'failed': return TransactionItemStatusEnum.failed;
        case r'pending': return TransactionItemStatusEnum.pending;
        default:
          if (!allowNull) {
            throw ArgumentError('Unknown enum value to decode: $data');
          }
      }
    }
    return null;
  }

  /// Singleton [TransactionItemStatusEnumTypeTransformer] instance.
  static TransactionItemStatusEnumTypeTransformer? _instance;
}


