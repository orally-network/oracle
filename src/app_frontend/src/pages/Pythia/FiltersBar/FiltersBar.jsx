import React from "react";
import { Col, Row, Radio } from "antd";
import Select from "react-select";
import Button from "Components/Button";

import { usePythiaData } from "Providers/PythiaData";
import { useSubscriptionsFilters } from "Providers/SubscriptionsFilters";
import { SingleValue, Option } from "../Subscription/NewSubscription";
import { mapChainsToOptions } from "../helper";

import styles from "./FiltersBar.scss";

const FiltersBar = () => {
  const { chains } = usePythiaData();

  const {
    showAll,
    showPair,
    chainId,
    showInactive,
    showRandom,
    setShowAll,
    setShowPair,
    setShowRandom,
    setShowInactive,
    setChainId,
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
        <Button
          type={showPair ? 'primary' : 'dashed'}
          onClick={() => setShowPair(!showPair)}
        >
          Pairs
        </Button>
      </Col>
      <Col>
        <Button
          type={showRandom ? 'primary' : 'dashed'}
          onClick={() => setShowRandom(!showRandom)}
        >
          Random
        </Button>
      </Col>
      <Col>
        <Button
          type={showInactive ? 'primary' : 'dashed'}
          onClick={() => setShowInactive(!showInactive)}
        >
          Inactive
        </Button>
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
    </Row>
  );
};

export default FiltersBar;
