//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of openapi.api;

class TxData {
  /// Returns a new [TxData] instance.
  TxData({
    this.address,
    this.chain,
    this.transactions = const [],
  });

  String? address;
  String? chain;
  List<TransactionItem> transactions;

  @override
  bool operator ==(Object other) => identical(this, other) || other is TxData &&
    other.address == address &&
    other.chain == chain &&
    _deepEquality.equals(other.transactions, transactions);

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (address == null ? 0 : address!.hashCode) +
    (chain == null ? 0 : chain!.hashCode) +
    (transactions.hashCode);

  @override
  String toString() => 'TxData[address=$address, chain=$chain, transactions=$transactions]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
    if (this.address != null) {
      json[r'address'] = this.address;
    } else {
      json[r'address'] = null;
    }
    if (this.chain != null) {
      json[r'chain'] = this.chain;
    } else {
      json[r'chain'] = null;
    }
      json[r'transactions'] = this.transactions;
    return json;
  }

  /// Returns a new [TxData] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static TxData? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      return TxData(
        address: mapValueOfType<String>(json, r'address'),
        chain: mapValueOfType<String>(json, r'chain'),
        transactions: TransactionItem.listFromJson(json[r'transactions']),
      );
    }
    return null;
  }

  static List<TxData> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <TxData>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = TxData.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, TxData> mapFromJson(dynamic json) {
    final map = <String, TxData>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = TxData.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of TxData-objects as value to a dart map
  static Map<String, List<TxData>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<TxData>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = TxData.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
  };
}
