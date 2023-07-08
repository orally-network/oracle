import React, { useState } from "react";
import { Col, Row, Radio, Switch } from "antd";
import Select from "react-select";

import { usePythiaData } from "Providers/PythiaData";
import { useSubscriptionsFilters } from "Providers/SubscriptionsFilters";
import { SingleValue, Option } from "../Subscription/NewSubscription";
import { mapChainsToOptions } from "../helper";

import styles from "./FiltersBar.scss";

const FiltersBar = ({}) => {
  const { chains } = usePythiaData();

  const {
    showAll,
    showPair,
    chainId,
    showInactive,
    setShowAll,
    setShowPair,
    setChainId,
    setShowInactive,
  } = useSubscriptionsFilters();

  return (
    <Row gutter={[16]} align="middle" className={styles.container}>
      <Col>
        <Radio.Group
          value={showAll}
          onChange={({ target: { value } }) => setShowAll(value)}
          options={[
            { label: "My", value: false },
            { label: "All", value: true },
          ]}
          optionType="button"
        />
      </Col>
      <Col>
        <Radio.Group
          value={showPair}
          onChange={({ target: { value } }) => setShowPair(value)}
          options={[
            { label: "Pairs", value: false },
            { label: "Random", value: true },
          ]}
          optionType="button"
        />
      </Col>
      <Col>
        <Select
          setValue={setChainId}
          value={chainId ? { label: chainId, value: chainId } : null}
          className={styles.chainSelect}
          styles={{
            singleValue: (base) => ({
              ...base,
              borderRadius: 5,
              display: "flex",
            }),
          }}
          components={{ SingleValue, Option }}
          options={mapChainsToOptions(chains)}
          onChange={(e) => setChainId(e.value)}
        />
      </Col>
      <Col>
        <Row align="middle">
          <div>Show inactive: </div>
          <Switch checked={showInactive} onChange={setShowInactive} />
        </Row>
      </Col>
    </Row>
  );
};

export default FiltersBar;
